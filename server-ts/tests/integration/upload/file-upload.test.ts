import request from 'supertest';
import { Application } from 'express';
import { DependencyContainer } from '@shared/utils/DependencyContainer';
import { AppServer } from '../../../src/main';
import { User } from '@domain/entities/User';
import { PasswordService } from '@infrastructure/external-services/PasswordService';
import fs from 'fs';
import path from 'path';

describe('File Upload Integration', () => {
  let app: Application;
  let container: DependencyContainer;
  let passwordService: PasswordService;
  let testUser: User;
  let accessToken: string;
  let testImagePath: string;
  let testTextFilePath: string;

  beforeAll(async () => {
    // Initialize the application
    const appServer = new AppServer();
    await appServer.initialize();
    app = appServer.getApp();
    container = DependencyContainer.getInstance();
    passwordService = new PasswordService();

    // Create test files
    const testDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create a small test image (1x1 pixel PNG)
    testImagePath = path.join(testDir, 'test-image.png');
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, // Image data
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testImagePath, pngBuffer);

    // Create a test text file
    testTextFilePath = path.join(testDir, 'test-file.txt');
    fs.writeFileSync(testTextFilePath, 'This is a test text file');

    // Create a test user
    const hashedPassword = await passwordService.hash('TestPassword123');
    testUser = User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    });

    await container.userRepository.create(testUser);

    // Login to get access token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'TestPassword123',
      })
      .expect(200);

    accessToken = loginResponse.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    // Cleanup test files
    const testDir = path.join(__dirname, 'test-files');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }

    // Cleanup uploaded files
    const uploadsDir = path.join(__dirname, '../../../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        if (file.startsWith('test-image') || file.startsWith('test-file')) {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      });
    }

    // Cleanup database
    if (container) {
      await container.cleanup();
    }
  });

  describe('POST /api/upload/image', () => {
    it('should upload image successfully', async () => {
      const response = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File uploaded successfully');
      expect(response.body.data.file).toMatchObject({
        originalName: 'test-image.png',
        mimetype: 'image/png',
        size: expect.any(Number),
        url: expect.stringMatching(/^http:\/\/.*\/uploads\/.*\.png$/),
        filename: expect.stringMatching(/.*\.png$/),
      });

      // Verify file exists on server
      const filename = response.body.data.file.filename;
      const filePath = path.join(__dirname, '../../../uploads', filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should reject non-image files', async () => {
      await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testTextFilePath)
        .expect(400);
    });

    it('should reject upload without authentication', async () => {
      await request(app)
        .post('/api/upload/image')
        .attach('file', testImagePath)
        .expect(401);
    });

    it('should reject upload without file', async () => {
      await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('POST /api/upload/avatar', () => {
    it('should upload avatar successfully', async () => {
      const response = await request(app)
        .post('/api/upload/avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Avatar uploaded successfully');
      expect(response.body.data.file).toMatchObject({
        originalName: 'test-image.png',
        mimetype: 'image/png',
        size: expect.any(Number),
        url: expect.stringMatching(/^http:\/\/.*\/uploads\/.*\.png$/),
        filename: expect.stringMatching(/.*\.png$/),
      });
      expect(response.body.data.avatarUrl).toBe(response.body.data.file.url);

      // Verify file exists on server
      const filename = response.body.data.file.filename;
      const filePath = path.join(__dirname, '../../../uploads', filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should reject non-image files for avatar', async () => {
      await request(app)
        .post('/api/upload/avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testTextFilePath)
        .expect(400);
    });

    it('should reject avatar upload without authentication', async () => {
      await request(app)
        .post('/api/upload/avatar')
        .attach('file', testImagePath)
        .expect(401);
    });

    it('should reject avatar upload without file', async () => {
      await request(app)
        .post('/api/upload/avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('File serving', () => {
    it('should serve uploaded files via /uploads endpoint', async () => {
      // First upload a file
      const uploadResponse = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      const filename = uploadResponse.body.data.file.filename;

      // Then try to access it via the static endpoint
      const fileResponse = await request(app)
        .get(`/uploads/${filename}`)
        .expect(200);

      expect(fileResponse.headers['content-type']).toMatch(/image/);
    });

    it('should return 404 for non-existent files', async () => {
      await request(app)
        .get('/uploads/non-existent-file.png')
        .expect(404);
    });
  });

  describe('File validation', () => {
    it('should generate unique filenames for uploads', async () => {
      // Upload the same file twice
      const response1 = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      const response2 = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      // Filenames should be different
      expect(response1.body.data.file.filename).not.toBe(response2.body.data.file.filename);
      
      // But original names should be the same
      expect(response1.body.data.file.originalName).toBe(response2.body.data.file.originalName);
    });

    it('should include correct file metadata', async () => {
      const response = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testImagePath)
        .expect(201);

      const fileData = response.body.data.file;
      expect(fileData.originalName).toBe('test-image.png');
      expect(fileData.mimetype).toBe('image/png');
      expect(fileData.size).toBeGreaterThan(0);
      expect(fileData.filename).toMatch(/.*\.png$/);
      expect(fileData.url).toContain('/uploads/');
    });
  });
});
