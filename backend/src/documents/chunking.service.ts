import { Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
  private readonly chunkSize = 1000;
  private readonly overlap = 200;

  createChunks(text: string): string[] {
    const chunks: string[] = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);

      const chunk = text.slice(start, end).trim();

      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      if (end === text.length) {
        break;
      }

      start = end - this.overlap;
    }

    return chunks;
  }
}