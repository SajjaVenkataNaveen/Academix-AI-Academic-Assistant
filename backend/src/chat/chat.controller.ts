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
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AddMessageDto } from './dto/add-message.dto';

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
        example: 'Income Question',
      },
      documentId: {
        type: 'string',
        example: 'cm123456789',
      },
    },
  },
})
createConversation(
  @Body() body: CreateConversationDto,
  @Req() req: any,
) {
  return this.chatService.createConversation(
    req.user.sub,
    body.title,
    body.documentId,
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
    @Body() body: AddMessageDto,
    @Req() req: any,
  ) {
    return this.chatService.addMessage(
      conversationId,
      req.user.sub,
      body.content,
    );
  }
}
