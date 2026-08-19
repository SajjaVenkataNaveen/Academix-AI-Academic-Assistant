import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { PrismaModule } from '../prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AiModule,
    DocumentsModule,
  ],

  controllers: [ChatController],

  providers: [ChatService],
})
export class ChatModule {}