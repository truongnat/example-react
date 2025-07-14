import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}

export class FileUploadService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    // Clean the filename to be URL-safe
    const cleanName = name
      .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace non-alphanumeric chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

    return `${cleanName}_${timestamp}_${random}${ext}`;
  }

  public getMulterConfig(): multer.Options {
    const storage = multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, this.uploadDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const fileName = this.generateFileName(file.originalname);
        cb(null, fileName);
      }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`));
      }
    };

    return {
      storage,
      fileFilter,
      limits: {
        fileSize: this.maxFileSize,
        files: 1
      }
    };
  }

  public processUploadedFile(file: Express.Multer.File, baseUrl: string): UploadedFile {
    // For files with spaces in filename, we need to encode the URL properly
    // Split the filename and encode only the filename part, not the path
    const pathParts = file.filename.split('/');
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    const url = `${baseUrl}/uploads/${encodedPath}`;

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url
    };
  }

  public deleteFile(filename: string): boolean {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  public validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}` };
    }

    if (file.size > this.maxFileSize) {
      return { valid: false, error: `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB` };
    }

    return { valid: true };
  }
}
