import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const rawKey = this.configService.get<string>(
      'ENCRYPTION_KEY',
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    );
    // Ensure key is 32 bytes Buffer
    if (rawKey.length === 64) {
      this.key = Buffer.from(rawKey, 'hex');
    } else {
      this.key = Buffer.alloc(32);
      Buffer.from(rawKey).copy(this.key);
    }
  }

  /**
   * Encrypts plaintext using AES-256-GCM
   * Returns formatted string: `${ivHex}:${authTagHex}:${ciphertextHex}`
   */
  encrypt(text: string | null | undefined): string | null {
    if (!text) return null;
    try {
      const iv = randomBytes(12); // 96-bit IV standard for GCM
      const cipher = createCipheriv('aes-256-gcm', this.key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (err: any) {
      this.logger.error(`Encryption failed: ${err.message}`);
      return null;
    }
  }

  /**
   * Decrypts ciphertext formatted as `${ivHex}:${authTagHex}:${ciphertextHex}`
   */
  decrypt(cipherText: string | null | undefined): string | null {
    if (!cipherText) return null;
    try {
      const parts = cipherText.split(':');
      if (parts.length !== 3) {
        // Fallback for unencrypted legacy or raw data
        return cipherText;
      }
      const [ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err: any) {
      this.logger.error(`Decryption failed: ${err.message}`);
      return null;
    }
  }

  /**
   * Masks sensitive strings, e.g. "ABCDE1234F" -> "AB****34F", "1234567890" -> "*******890"
   */
  mask(text: string | null | undefined, visibleTail: number = 4): string {
    if (!text) return '';
    if (text.length <= visibleTail) return '****';
    const head = text.substring(0, Math.min(2, text.length - visibleTail));
    const tail = text.substring(text.length - visibleTail);
    const stars = '*'.repeat(text.length - head.length - tail.length);
    return `${head}${stars}${tail}`;
  }
}
