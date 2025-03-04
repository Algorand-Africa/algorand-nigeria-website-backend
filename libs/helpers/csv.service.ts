import { Logger } from '@nestjs/common';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { PassThrough } from 'stream';
import * as fs from 'fs';

export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  async generateCsv(
    headers: string[],
    data: object[],
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    const path = `./${fileName}.csv`;
    const csvWriter = createCsvWriter({
      path,
      header: headers.map((header) => ({ id: header, title: header })),
    });

    try {
      await csvWriter.writeRecords(data);

      const bufferStream = new PassThrough();
      const fileStream = fs.createReadStream(path);
      fileStream.pipe(bufferStream);

      return new Promise<{
        path: string;
        status: 'successful';
        content: Buffer;
      }>((resolve, reject) => {
        const chunks: Buffer[] = [];
        bufferStream.on('data', (chunk) => chunks.push(chunk));
        bufferStream.on('end', () =>
          resolve({
            path,
            status: 'successful',
            content: Buffer.concat(chunks),
          }),
        );
        bufferStream.on('error', (err) => {
          console.error('Buffer Stream Error:', err);
          reject({ path: '', status: 'failed', content: Buffer.alloc(0) });
        });
      });
    } catch (err) {
      this.logger.error(err);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }
}
