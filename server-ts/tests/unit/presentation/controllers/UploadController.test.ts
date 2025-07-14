import { Request, Response, NextFunction } from 'express';
import { UploadController } from '@presentation/controllers/UploadController';
import { FileUploadService } from '@infrastructure/external-services/FileUploadService';
import { ValidationException } from '@shared/exceptions';
import { HTTP_STATUS } from '@shared/constants';

// Mock FileUploadService
const mockFileUploadService = {
  validateFile: jest.fn(),
  processUploadedFile: jest.fn(),
  deleteFile: jest.fn(),
} as jest.Mocked<Partial<FileUploadService>>;

describe('UploadController', () => {
  let uploadController: UploadController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    uploadController = new UploadController(mockFileUploadService as FileUploadService);
    
    mockRequest = {
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:5000'),
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      // Arrange
      const mockFile = {
        filename: 'test_123456_abc123.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadedFile = {
        filename: 'test_123456_abc123.jpg',
        originalName: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        url: 'http://localhost:5000/uploads/test_123456_abc123.jpg',
      };

      mockRequest.file = mockFile;
      mockFileUploadService.validateFile!.mockReturnValue({ valid: true });
      mockFileUploadService.processUploadedFile!.mockReturnValue(mockUploadedFile);

      // Act
      await uploadController.uploadImage(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(mockFileUploadService.processUploadedFile).toHaveBeenCalledWith(mockFile, 'http://localhost:5000');
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          file: mockUploadedFile,
        },
        message: 'File uploaded successfully',
      });
    });

    it('should throw ValidationException when no file is uploaded', async () => {
      // Arrange
      mockRequest.file = undefined;

      // Act
      await uploadController.uploadImage(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException));
    });

    it('should delete file and throw ValidationException when validation fails', async () => {
      // Arrange
      const mockFile = {
        filename: 'test.txt',
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 1024,
      } as Express.Multer.File;

      mockRequest.file = mockFile;
      mockFileUploadService.validateFile!.mockReturnValue({
        valid: false,
        error: 'Invalid file type',
      });
      mockFileUploadService.deleteFile!.mockReturnValue(true);

      // Act
      await uploadController.uploadImage(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(mockFileUploadService.deleteFile).toHaveBeenCalledWith(mockFile.filename);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException));
    });

    it('should delete file when processing throws error', async () => {
      // Arrange
      const mockFile = {
        filename: 'test.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      mockRequest.file = mockFile;
      mockFileUploadService.validateFile!.mockReturnValue({ valid: true });
      mockFileUploadService.processUploadedFile!.mockImplementation(() => {
        throw new Error('Processing failed');
      });
      mockFileUploadService.deleteFile!.mockReturnValue(true);

      // Act
      await uploadController.uploadImage(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.deleteFile).toHaveBeenCalledWith(mockFile.filename);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar successfully', async () => {
      // Arrange
      const mockFile = {
        filename: 'avatar_123456_abc123.jpg',
        originalname: 'avatar.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadedFile = {
        filename: 'avatar_123456_abc123.jpg',
        originalName: 'avatar.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        url: 'http://localhost:5000/uploads/avatar_123456_abc123.jpg',
      };

      mockRequest.file = mockFile;
      mockFileUploadService.validateFile!.mockReturnValue({ valid: true });
      mockFileUploadService.processUploadedFile!.mockReturnValue(mockUploadedFile);

      // Act
      await uploadController.uploadAvatar(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(mockFileUploadService.processUploadedFile).toHaveBeenCalledWith(mockFile, 'http://localhost:5000');
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          file: mockUploadedFile,
          avatarUrl: mockUploadedFile.url,
        },
        message: 'Avatar uploaded successfully',
      });
    });

    it('should throw ValidationException when no avatar file is uploaded', async () => {
      // Arrange
      mockRequest.file = undefined;

      // Act
      await uploadController.uploadAvatar(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException));
    });

    it('should reject avatar file larger than 2MB', async () => {
      // Arrange
      const mockFile = {
        filename: 'large_avatar.jpg',
        originalname: 'large_avatar.jpg',
        mimetype: 'image/jpeg',
        size: 3 * 1024 * 1024, // 3MB
      } as Express.Multer.File;

      mockRequest.file = mockFile;
      mockFileUploadService.deleteFile!.mockReturnValue(true);

      // Act
      await uploadController.uploadAvatar(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.deleteFile).toHaveBeenCalledWith(mockFile.filename);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException));
    });

    it('should delete file and throw ValidationException when avatar validation fails', async () => {
      // Arrange
      const mockFile = {
        filename: 'avatar.txt',
        originalname: 'avatar.txt',
        mimetype: 'text/plain',
        size: 1024,
      } as Express.Multer.File;

      mockRequest.file = mockFile;
      mockFileUploadService.validateFile!.mockReturnValue({
        valid: false,
        error: 'Invalid file type',
      });
      mockFileUploadService.deleteFile!.mockReturnValue(true);

      // Act
      await uploadController.uploadAvatar(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockFileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(mockFileUploadService.deleteFile).toHaveBeenCalledWith(mockFile.filename);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException));
    });
  });
});
