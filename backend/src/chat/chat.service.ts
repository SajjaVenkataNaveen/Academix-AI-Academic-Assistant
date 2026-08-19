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

  async createConversation(userId: string, title?: string) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title,
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

  private async findRelevantChunks(question: string) {
  // 1. Generate embedding for the question
  const questionEmbedding =
    await this.embeddingService.generateEmbedding(question);

  // 2. Get all stored chunks
  const chunks = await this.prisma.documentChunk.findMany();

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

  // 5. Return top 3
  return rankedChunks.slice(0, 3);
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

    // 3. Find relevant document chunks
const relevantChunks =
  await this.findRelevantChunks(content);

console.log(
  'Relevant chunks:',
  relevantChunks.map((chunk) => ({
    chunkIndex: chunk.chunkIndex,
    similarity: chunk.similarity,
  })),
);

  const context = relevantChunks
  .map((chunk) => chunk.content)
  .join('\n\n');

    // 4. Send question + context to Gemini
const prompt = `
You are an academic assistant.

Answer the user's question using the provided document context.

If the answer is not present in the context, say:
"I could not find this information in the uploaded documents."

Document context:
${context}

User question:
${content}
`;

const aiResponse =
  await this.aiService.generateResponse(prompt);

    // 4. Save Gemini's response
    const aiMessage = await this.prisma.message.create({
      data: {
        content: aiResponse,
        sender: 'AI',
        conversationId,
      },
    });

    // 5. Return both messages
    return {
      userMessage,
      aiMessage,
    };
  }
}