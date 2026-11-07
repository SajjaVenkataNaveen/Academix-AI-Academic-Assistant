import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma.service';
import { TextExtractionService } from './text-extraction.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: {} },
        { provide: TextExtractionService, useValue: {} },
        { provide: ChunkingService, useValue: {} },
        { provide: EmbeddingService, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
