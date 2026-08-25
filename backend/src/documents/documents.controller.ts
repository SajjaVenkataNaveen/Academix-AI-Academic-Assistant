import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  @Get()
  getDocuments() {
    return this.documentsService.getDocuments();
  }

  @Get(':id')
  getDocument(@Param('id') id: string) {
    return this.documentsService.getDocument(id);
  }

  @Post('upload')
  @Roles('FACULTY', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadDocument(@UploadedFile() file: any) {
    return this.documentsService.uploadDocument(file);
  }

  @Delete(':id')
  @Roles('FACULTY', 'ADMIN')
  deleteDocument(@Param('id') id: string) {
    return this.documentsService.deleteDocument(id);
  }
}