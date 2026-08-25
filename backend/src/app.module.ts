import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [PrismaModule, UsersModule, AuthModule,ChatModule, DocumentsModule],
})
export class AppModule {}