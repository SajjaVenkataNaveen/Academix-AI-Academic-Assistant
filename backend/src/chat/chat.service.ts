import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
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

    // 3. Send message to Gemini
    const aiResponse = await this.aiService.generateResponse(content);

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