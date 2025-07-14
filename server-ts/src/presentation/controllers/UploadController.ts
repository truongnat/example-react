import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '@infrastructure/external-services/FileUploadService';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';
import { ValidationException } from '@shared/exceptions';

export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new ValidationException('No file uploaded');
      }

      // Validate the uploaded file
      const validation = this.fileUploadService.validateFile(req.file);
      if (!validation.valid) {
        // Delete the uploaded file if validation fails
        this.fileUploadService.deleteFile(req.file.filename);
        throw new ValidationException(validation.error || 'Invalid file');
      }

      // Get base URL for constructing file URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Process the uploaded file
      const uploadedFile = this.fileUploadService.processUploadedFile(req.file, baseUrl);

      const response: ApiResponse = {
        success: true,
        data: {
          file: uploadedFile
        },
        message: 'File uploaded successfully'
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      // Clean up uploaded file if there was an error
      if (req.file) {
        this.fileUploadService.deleteFile(req.file.filename);
      }
      next(error);
    }
  };

  uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new ValidationException('No avatar file uploaded');
      }

      // Additional validation for avatars (stricter size limit)
      const maxAvatarSize = 2 * 1024 * 1024; // 2MB for avatars
      if (req.file.size > maxAvatarSize) {
        this.fileUploadService.deleteFile(req.file.filename);
        throw new ValidationException('Avatar file size must be less than 2MB');
      }

      // Validate the uploaded file
      const validation = this.fileUploadService.validateFile(req.file);
      if (!validation.valid) {
        this.fileUploadService.deleteFile(req.file.filename);
        throw new ValidationException(validation.error || 'Invalid avatar file');
      }

      // Get base URL for constructing file URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Process the uploaded file
      const uploadedFile = this.fileUploadService.processUploadedFile(req.file, baseUrl);

      const response: ApiResponse = {
        success: true,
        data: {
          file: uploadedFile,
          avatarUrl: uploadedFile.url
        },
        message: 'Avatar uploaded successfully'
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      // Clean up uploaded file if there was an error
      if (req.file) {
        this.fileUploadService.deleteFile(req.file.filename);
      }
      next(error);
    }
  };
}
