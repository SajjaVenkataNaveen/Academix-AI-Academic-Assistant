import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.sub);
  }

  @Get(':id')
  getConversation(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.chatService.getConversation(
      id,
      req.user.sub,
    );
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'DBMS Doubts',
        },
      },
    },
  })
  createConversation(
    @Body('title') title: string,
    @Req() req: any,
  ) {
    return this.chatService.createConversation(
      req.user.sub,
      title,
    );
  }

  @Post(':id/messages')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Explain normalization in DBMS',
        },
      },
    },
  })
  addMessage(
    @Param('id') conversationId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.chatService.addMessage(
      conversationId,
      req.user.sub,
      content,
    );
  }
}