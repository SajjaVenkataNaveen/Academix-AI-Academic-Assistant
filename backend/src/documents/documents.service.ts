import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma.service';
import { TextExtractionService } from './text-extraction.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly textExtractionService: TextExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async getDocuments() {
    return this.prisma.document.findMany({
      select: {
        id: true,
        title: true,
        filename: true,
        mimetype: true,
        size: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { chunks: true, conversations: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getDocument(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        filename: true,
        mimetype: true,
        size: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { chunks: true, conversations: true } },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async uploadDocument(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('A PDF file is required');
    }
    // 1. Extract text from PDF
    const extractedText =
  file.mimetype === 'application/pdf'
    ? await this.textExtractionService.extractText(file.path)
    : null;

    if (!extractedText?.trim()) {
      await fs.unlink(file.path).catch(() => undefined);
      throw new BadRequestException('No readable text could be extracted from this PDF');
    }

    // 2. Create chunks
    const chunks = extractedText
      ? this.chunkingService.createChunks(extractedText)
      : [];

    console.log('Total chunks:', chunks.length);

    // 3. Save document
    const document = await this.prisma.document.create({
      data: {
        title: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        extractedText,
      },
    });

    // 4. Generate embeddings and save chunks
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Generating embedding for chunk ${i + 1}/${chunks.length}`);

      const embedding =
        await this.embeddingService.generateEmbedding(chunks[i]);

      await this.prisma.documentChunk.create({
        data: {
          content: chunks[i],
          chunkIndex: i,
          embedding,
          documentId: document.id,
        },
      });
    }

    // 5. Get document with chunks
    const savedDocument = await this.prisma.document.findUnique({
      where: {
        id: document.id,
      },
      include: {
        chunks: true,
      },
    });

    return {
      message: 'Document uploaded successfully',
      document: savedDocument,
    };
  }

  async deleteDocument(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const deleted = await this.prisma.document.delete({
      where: { id },
    });
    await fs.unlink(document.path).catch(() => undefined);
    return deleted;
  }
}
