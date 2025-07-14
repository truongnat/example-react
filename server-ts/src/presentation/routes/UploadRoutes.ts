import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '@presentation/controllers/UploadController';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';
import { FileUploadService } from '@infrastructure/external-services/FileUploadService';

export class UploadRoutes {
  private router: Router;
  private upload: multer.Multer;

  constructor(
    private readonly uploadController: UploadController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly fileUploadService: FileUploadService
  ) {
    this.router = Router();
    this.upload = multer(this.fileUploadService.getMulterConfig());
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Apply authentication middleware to all upload routes
    this.router.use(this.authMiddleware.authenticate);

    /**
     * @swagger
     * /api/upload/image:
     *   post:
     *     summary: Upload an image file
     *     tags: [Upload]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Image file to upload (JPEG, PNG, GIF, WebP)
     *     responses:
     *       201:
     *         description: File uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         file:
     *                           type: object
     *                           properties:
     *                             filename:
     *                               type: string
     *                             originalName:
     *                               type: string
     *                             mimetype:
     *                               type: string
     *                             size:
     *                               type: number
     *                             url:
     *                               type: string
     *       400:
     *         description: Invalid file or validation error
     *       401:
     *         description: Unauthorized
     *       413:
     *         description: File too large
     */
    this.router.post(
      '/image',
      this.upload.single('file'),
      this.uploadController.uploadImage
    );

    /**
     * @swagger
     * /api/upload/avatar:
     *   post:
     *     summary: Upload an avatar image
     *     tags: [Upload]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Avatar image file (max 2MB)
     *     responses:
     *       201:
     *         description: Avatar uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         file:
     *                           type: object
     *                           properties:
     *                             filename:
     *                               type: string
     *                             originalName:
     *                               type: string
     *                             mimetype:
     *                               type: string
     *                             size:
     *                               type: number
     *                             url:
     *                               type: string
     *                         avatarUrl:
     *                           type: string
     *       400:
     *         description: Invalid file or validation error
     *       401:
     *         description: Unauthorized
     *       413:
     *         description: File too large
     */
    this.router.post(
      '/avatar',
      this.upload.single('file'),
      this.uploadController.uploadAvatar
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
