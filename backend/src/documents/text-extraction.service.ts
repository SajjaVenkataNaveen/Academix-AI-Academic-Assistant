import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createWorker } from 'tesseract.js';

const execFileAsync = promisify(execFile);

@Injectable()
export class TextExtractionService {
  async extractText(filePath: string): Promise<string> {
    const tempDir = path.join(
      path.dirname(filePath),
      `ocr-${Date.now()}`,
    );

    fs.mkdirSync(tempDir, { recursive: true });

    try {
      console.log('========== PDF TEXT EXTRACTION ==========');

      // --------------------------------------------------
      // STEP 1: Try Poppler's pdftotext
      // --------------------------------------------------

      try {
        const { stdout } = await execFileAsync('pdftotext', [
          '-layout',
          filePath,
          '-',
        ]);

        const text = stdout.trim();

        console.log('Extracted text length:', text.length);

        if (text.length > 50) {
          console.log('Useful PDF text found.');
          console.log('========================================');

          return text;
        }

        console.log('No useful text found. Starting OCR...');
      } catch (error) {
        console.log('pdftotext failed. Starting OCR...');
      }

      // --------------------------------------------------
      // STEP 2: Convert PDF pages to PNG using Poppler
      // --------------------------------------------------

      const outputPrefix = path.join(tempDir, 'page');

      await execFileAsync('pdftoppm', [
        '-png',
        '-r',
        '200',
        filePath,
        outputPrefix,
      ]);

      const imageFiles = fs
        .readdirSync(tempDir)
        .filter((file) => file.endsWith('.png'))
        .sort();

      console.log(`PDF pages converted to ${imageFiles.length} PNG image(s).`);

      if (imageFiles.length === 0) {
        throw new Error('No PNG images were generated from the PDF.');
      }

      // --------------------------------------------------
      // STEP 3: OCR using Tesseract
      // --------------------------------------------------

      const worker = await createWorker('eng');

      let ocrText = '';

      try {
        for (let i = 0; i < imageFiles.length; i++) {
          const imagePath = path.join(tempDir, imageFiles[i]);

          console.log(
            `Running OCR on page ${i + 1}/${imageFiles.length}...`,
          );

          const result = await worker.recognize(imagePath);

          ocrText += `\n\n--- PAGE ${i + 1} ---\n\n`;
          ocrText += result.data.text;
        }
      } finally {
        await worker.terminate();
      }

      console.log('========== OCR RESULT ==========');
      console.log(ocrText);
      console.log('=================================');

      return ocrText.trim();
    } finally {
      // --------------------------------------------------
      // STEP 4: Delete temporary PNG files
      // --------------------------------------------------

      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, {
          recursive: true,
          force: true,
        });
      }
    }
  }
}