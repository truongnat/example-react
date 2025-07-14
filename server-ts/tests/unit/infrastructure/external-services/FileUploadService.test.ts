import { FileUploadService } from '@infrastructure/external-services/FileUploadService';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;
  const mockUploadDir = './test-uploads';

  beforeEach(() => {
    fileUploadService = new FileUploadService();
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.UPLOAD_DIR = mockUploadDir;
    process.env.MAX_FILE_SIZE = '5242880'; // 5MB
  });

  afterEach(() => {
    delete process.env.UPLOAD_DIR;
    delete process.env.MAX_FILE_SIZE;
  });

  describe('constructor', () => {
    it('should create upload directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation();

      new FileUploadService();

      expect(mockFs.existsSync).toHaveBeenCalledWith(mockUploadDir);
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(mockUploadDir, { recursive: true });
    });

    it('should not create upload directory if it already exists', () => {
      mockFs.existsSync.mockReturnValue(true);

      new FileUploadService();

      expect(mockFs.existsSync).toHaveBeenCalledWith(mockUploadDir);
      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getMulterConfig', () => {
    it('should return valid multer configuration', () => {
      const config = fileUploadService.getMulterConfig();

      expect(config).toHaveProperty('storage');
      expect(config).toHaveProperty('fileFilter');
      expect(config).toHaveProperty('limits');
      expect(config.limits).toEqual({
        fileSize: 5242880,
        files: 1,
      });
    });

    it('should accept valid image file types', () => {
      const config = fileUploadService.getMulterConfig();
      const mockFile = {
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const mockReq = {} as any;
      const mockCallback = jest.fn();

      config.fileFilter!(mockReq, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should reject invalid file types', () => {
      const config = fileUploadService.getMulterConfig();
      const mockFile = {
        mimetype: 'text/plain',
      } as Express.Multer.File;
      const mockReq = {} as any;
      const mockCallback = jest.fn();

      config.fileFilter!(mockReq, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('processUploadedFile', () => {
    it('should process uploaded file and return correct structure', () => {
      const mockFile = {
        filename: 'test_123456_abc123.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;
      const baseUrl = 'http://localhost:5000';

      const result = fileUploadService.processUploadedFile(mockFile, baseUrl);

      expect(result).toEqual({
        filename: 'test_123456_abc123.jpg',
        originalName: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        url: 'http://localhost:5000/uploads/test_123456_abc123.jpg',
      });
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file successfully', () => {
      const filename = 'test.jpg';
      const expectedPath = path.join(mockUploadDir, filename);
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlinkSync.mockImplementation();

      const result = fileUploadService.deleteFile(filename);

      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(expectedPath);
    });

    it('should return false when file does not exist', () => {
      const filename = 'nonexistent.jpg';
      
      mockFs.existsSync.mockReturnValue(false);

      const result = fileUploadService.deleteFile(filename);

      expect(result).toBe(false);
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should return false when deletion fails', () => {
      const filename = 'test.jpg';
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlinkSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = fileUploadService.deleteFile(filename);

      expect(result).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should validate correct image file', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const result = fileUploadService.validateFile(mockFile);

      expect(result).toEqual({ valid: true });
    });

    it('should reject file with invalid mimetype', () => {
      const mockFile = {
        mimetype: 'text/plain',
        size: 1024,
      } as Express.Multer.File;

      const result = fileUploadService.validateFile(mockFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should reject file that is too large', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      const result = fileUploadService.validateFile(mockFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('File too large');
    });

    it('should reject when no file is provided', () => {
      const result = fileUploadService.validateFile(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });
  });
});
