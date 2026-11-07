import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { EmbeddingService } from '../documents/embedding.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        userId,
      },
      include: {
        messages: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async createConversation(
  userId: string,
  title?: string,
  documentId?: string,
) {
  if (documentId) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }
  }

  return this.prisma.conversation.create({
    data: {
      userId,
      title,
      documentId,
    },
  });
}

  private cosineSimilarity(a: number[], b: number[]): number {
  // Invalid embeddings
  if (!a || !b || a.length === 0 || b.length === 0) {
    return 0;
  }

  // Embeddings must have the same dimensions
  if (a.length !== b.length) {
    console.log(
      `Embedding dimension mismatch: question=${a.length}, chunk=${b.length}`,
    );
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    // Prevent NaN / Infinity from entering the calculation
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) {
      return 0;
    }

    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}

  private async findRelevantChunks(
  question: string,
  documentId: string,
) {
  // 1. Generate embedding for the question
  const questionEmbedding =
    await this.embeddingService.generateEmbedding(question);

  // 2. Get chunks ONLY from this document
  const chunks = await this.prisma.documentChunk.findMany({
  where: {
    documentId,
  },
  include: {
    document: {
      select: {
        id: true,
        title: true,
        filename: true,
      },
    },
  },
});

  console.log(
    `Searching ${chunks.length} chunks from document ${documentId}`,
  );

  // 3. Calculate similarity
  const rankedChunks = chunks
    .map((chunk) => ({
      ...chunk,
      similarity: this.cosineSimilarity(
        questionEmbedding,
        chunk.embedding,
      ),
    }))
    .filter((chunk) => Number.isFinite(chunk.similarity));

  // 4. Sort by highest similarity
  rankedChunks.sort(
    (a, b) => b.similarity - a.similarity,
  );

 // 5. Keep only sufficiently relevant chunks
const relevantChunks = rankedChunks
  .filter((chunk) => chunk.similarity >= 0.45)
  .slice(0, 3);

return relevantChunks;
}

  private generateConversationTitle(content: string): string {
  const cleaned = content
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'New Conversation';
  }

  if (cleaned.length <= 50) {
    return cleaned;
  }

  return `${cleaned.substring(0, 47)}...`;
}

  async addMessage(
  conversationId: string,
  userId: string,
  content: string,
) {
  // 1. Check conversation belongs to logged-in user
  const conversation = await this.prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  // 2. Save user's message
  const userMessage = await this.prisma.message.create({
    data: {
      content,
      sender: 'USER',
      conversationId,
    },
  });

  // Automatically generate title from the first user message
if (!conversation.title) {
  const title = this.generateConversationTitle(content);

  await this.prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      title,
    },
  });
}

  // 3. Make sure a document is attached
  if (!conversation.documentId) {
    throw new NotFoundException(
      'No document is attached to this conversation',
    );
  }

  // 4. Get previous conversation messages
  const previousMessages =
    await this.prisma.message.findMany({
      where: {
        conversationId,
        id: {
          not: userMessage.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
    });

  // 5. Find relevant document chunks
  const relevantChunks =
    await this.findRelevantChunks(
      content,
      conversation.documentId,
    );

  console.log(
    'Relevant chunks:',
    relevantChunks.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      similarity: chunk.similarity,
    })),
  );

  // 6. Create conversation history
  const conversationHistory = previousMessages
    .map((message) => {
      const role =
        message.sender === 'USER'
          ? 'User'
          : 'Assistant';

      return `${role}: ${message.content}`;
    })
    .join('\n');

  // 7. If no relevant document information was found
  if (relevantChunks.length === 0) {
    const aiMessage = await this.prisma.message.create({
      data: {
        content:
          'I could not find this information in the uploaded document.',
        sender: 'AI',
        conversationId,
      },
    });

    return {
      userMessage,
      aiMessage,
      sources: [],
    };
  }

  // 8. Build document context
  const context = relevantChunks
    .map((chunk) => chunk.content)
    .join('\n\n');

  // 9. Create prompt for Gemini
  const prompt = `
You are an academic assistant.

Answer the user's question using the provided document context
and the previous conversation.

Use the conversation history to understand references such as:
"he", "she", "it", "that", "the candidate", "the above", etc.

Answer only using information supported by the document context
and conversation.

Write in clear, friendly language for a student. Start with the direct
answer instead of phrases such as "Based on the provided context".
Use short paragraphs and Markdown bullet or numbered lists when they make
the answer easier to scan. Use bold text sparingly for meaningful terms or
headings. Do not use decorative symbols or unnecessary formatting.

If the answer is not present in the context, say:
"I could not find this information in the uploaded documents."

Previous conversation:
${conversationHistory}

Document context:
${context}

Current user question:
${content}
`;

  // 10. Send prompt to Gemini
  const aiResponse =
    await this.aiService.generateResponse(prompt);

  const sources = relevantChunks.map((chunk) => ({
    documentId: chunk.document.id,
    documentTitle: chunk.document.title,
    filename: chunk.document.filename,
    chunkIndex: chunk.chunkIndex,
    similarity: chunk.similarity,
  }));

  // 11. Save Gemini's response and the references used to produce it
  const aiMessage = await this.prisma.message.create({
    data: {
      content: aiResponse,
      sender: 'AI',
      conversationId,
      sources,
    },
  });

  // 12. Return messages + sources
  return {
    userMessage,
    aiMessage,
    sources,
  };
}
}
