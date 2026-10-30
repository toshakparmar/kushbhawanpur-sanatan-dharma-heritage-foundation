import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface UploadOptions {
  folder?: string;
  allowedMimes?: string[];
  maxSizeBytes?: number;
}

export interface StoredFile {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: string;
  private readonly uploadDir: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.driver = this.configService.get<string>('STORAGE_DRIVER', 'local');
    this.uploadDir = path.resolve(
      process.cwd(),
      this.configService.get<string>('UPLOAD_DIR', './uploads'),
    );
    this.apiUrl = this.configService.get<string>('API_URL', 'http://localhost:4000');

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Saves a buffer to storage (local disk or cloud)
   */
  async saveBuffer(
    buffer: Buffer,
    originalFilename: string,
    mimeType: string,
    options: UploadOptions = {},
  ): Promise<StoredFile> {
    const ext = path.extname(originalFilename).toLowerCase() || this.getExtensionFromMime(mimeType);
    const subfolder = options.folder ? options.folder.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
    const filename = `${randomUUID()}${ext}`;

    const targetDir = path.join(this.uploadDir, subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, filename);
    await fs.promises.writeFile(targetPath, buffer);

    const relativeUrl = `/uploads/${subfolder}/${filename}`;
    const fullUrl = `${this.apiUrl}${relativeUrl}`;

    return {
      url: fullUrl,
      key: `${subfolder}/${filename}`,
      size: buffer.length,
      mimeType,
    };
  }

  /**
   * Deletes a stored file by key
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err: any) {
      this.logger.error(`Error deleting file ${key}: ${err.message}`);
      return false;
    }
  }

  private getExtensionFromMime(mime: string): string {
    switch (mime) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'application/pdf':
        return '.pdf';
      default:
        return '.bin';
    }
  }
}
