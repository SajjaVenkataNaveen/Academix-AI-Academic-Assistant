import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  async extractText(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    return result.text;
  }
}