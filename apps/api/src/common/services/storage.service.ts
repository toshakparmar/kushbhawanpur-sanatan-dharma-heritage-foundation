import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { StorageClient } from '@supabase/storage-js';

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
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private driver: 'supabase' | 'local';
  private readonly uploadDir: string;
  private readonly apiUrl: string;

  // Supabase Storage Configuration
  private storageClient: StorageClient | null = null;
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;
  private readonly bucketName: string;
  private bucketEnsured = false;

  constructor(private configService: ConfigService) {
    const configuredDriver = this.configService.get<string>('STORAGE_DRIVER', 'supabase').toLowerCase();
    this.uploadDir = path.resolve(
      process.cwd(),
      this.configService.get<string>('UPLOAD_DIR', './uploads'),
    );
    this.apiUrl = this.configService.get<string>('API_URL', 'http://localhost:4000');

    this.supabaseUrl =
      this.configService.get<string>('SUPABASE_URL') ||
      'https://racqnmwrulqqvqjcsxfn.supabase.co';
    this.supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY') ||
      this.configService.get<string>('SUPABASE_KEY') ||
      '';
    this.bucketName =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET', 'kushbhawanpur-media');

    if (configuredDriver === 'supabase' && this.supabaseUrl && this.supabaseKey) {
      this.driver = 'supabase';
      const storageApiUrl = `${this.supabaseUrl.replace(/\/+$/, '')}/storage/v1`;
      this.storageClient = new StorageClient(storageApiUrl, {
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      });
      this.logger.log(`StorageService initialized with Supabase Storage Bucket: "${this.bucketName}"`);
    } else {
      this.driver = 'local';
      if (configuredDriver === 'supabase') {
        this.logger.warn(
          'STORAGE_DRIVER is set to "supabase", but SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is not configured. Falling back to local disk storage.',
        );
      } else {
        this.logger.log('StorageService initialized with local disk storage.');
      }
    }

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async onModuleInit() {
    if (this.driver === 'supabase' && this.storageClient) {
      await this.ensureBucketExists();
    }
  }

  /**
   * Ensures the target Supabase storage bucket exists and is public.
   */
  private async ensureBucketExists(): Promise<void> {
    if (this.bucketEnsured || !this.storageClient) return;

    try {
      const { data: buckets, error } = await this.storageClient.listBuckets();
      if (error) {
        this.logger.warn(`Could not list Supabase storage buckets: ${error.message}`);
        return;
      }

      const exists = buckets?.some((b) => b.name === this.bucketName);
      if (!exists) {
        const { error: createError } = await this.storageClient.createBucket(
          this.bucketName,
          {
            public: true,
            fileSizeLimit: 10485760, // 10 MB limit per file
          },
        );

        if (createError) {
          this.logger.warn(`Failed to create bucket "${this.bucketName}": ${createError.message}`);
        } else {
          this.logger.log(`Created public Supabase storage bucket: "${this.bucketName}"`);
        }
      }
      this.bucketEnsured = true;
    } catch (err: any) {
      this.logger.warn(`Bucket initialization check skipped: ${err.message}`);
    }
  }

  /**
   * Saves a buffer to storage (Supabase Bucket or local disk fallback)
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
    const key = `${subfolder}/${filename}`;

    // 1. Supabase Storage Driver
    if (this.driver === 'supabase' && this.storageClient) {
      try {
        await this.ensureBucketExists();

        const { error: uploadError } = await this.storageClient
          .from(this.bucketName)
          .upload(key, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          this.logger.error(
            `Supabase upload failed for "${key}": ${uploadError.message}. Falling back to local disk.`,
          );
        } else {
          const { data: urlData } = this.storageClient
            .from(this.bucketName)
            .getPublicUrl(key);

          this.logger.log(`Uploaded "${key}" to Supabase Storage: ${urlData.publicUrl}`);

          return {
            url: urlData.publicUrl,
            key,
            size: buffer.length,
            mimeType,
          };
        }
      } catch (err: any) {
        this.logger.error(
          `Exception uploading to Supabase: ${err.message}. Falling back to local disk.`,
        );
      }
    }

    // 2. Local Disk Storage Fallback
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
      key,
      size: buffer.length,
      mimeType,
    };
  }

  /**
   * Deletes a stored file by key from Supabase Storage and/or local disk
   */
  async deleteFile(key: string): Promise<boolean> {
    let deleted = false;

    // Supabase deletion
    if (this.driver === 'supabase' && this.storageClient) {
      try {
        const { error } = await this.storageClient
          .from(this.bucketName)
          .remove([key]);

        if (!error) {
          deleted = true;
          this.logger.log(`Deleted file "${key}" from Supabase Storage bucket "${this.bucketName}"`);
        } else {
          this.logger.warn(`Could not delete "${key}" from Supabase: ${error.message}`);
        }
      } catch (err: any) {
        this.logger.error(`Error deleting from Supabase: ${err.message}`);
      }
    }

    // Also remove from local disk if it exists
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        deleted = true;
      }
    } catch (err: any) {
      this.logger.error(`Error deleting local file ${key}: ${err.message}`);
    }

    return deleted;
  }

  private getExtensionFromMime(mime: string): string {
    switch (mime) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/svg+xml':
        return '.svg';
      case 'application/pdf':
        return '.pdf';
      default:
        return '.bin';
    }
  }
}
