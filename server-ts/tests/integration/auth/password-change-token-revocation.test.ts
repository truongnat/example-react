import request from 'supertest';
import { Application } from 'express';
import { DependencyContainer } from '@shared/utils/DependencyContainer';
import { AppServer } from '../../../src/main';
import { User } from '@domain/entities/User';
import { PasswordService } from '@infrastructure/external-services/PasswordService';

describe('Password Change and Token Revocation Integration', () => {
  let app: Application;
  let container: DependencyContainer;
  let passwordService: PasswordService;
  let testUser: User;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Initialize the application
    const appServer = new AppServer();
    await appServer.initialize();
    app = appServer.getApp();
    container = DependencyContainer.getInstance();
    passwordService = new PasswordService();

    // Create a test user
    const hashedPassword = await passwordService.hash('TestPassword123');
    testUser = User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    });

    await container.userRepository.create(testUser);
  });

  beforeEach(async () => {
    // Login to get fresh tokens before each test
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'TestPassword123',
      })
      .expect(200);

    accessToken = loginResponse.body.data.tokens.accessToken;
    refreshToken = loginResponse.body.data.tokens.refreshToken;
  });

  afterAll(async () => {
    // Cleanup
    if (container) {
      await container.cleanup();
    }
  });

  describe('Password Change Flow', () => {
    it('should change password successfully and revoke all existing tokens', async () => {
      // Step 1: Verify current token works
      const profileResponse1 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse1.body.data.user.email).toBe(testUser.email);

      // Step 2: Change password
      const changePasswordResponse = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(200);

      expect(changePasswordResponse.body.success).toBe(true);
      expect(changePasswordResponse.body.message).toBe('Password changed successfully');

      // Step 3: Verify old token is now invalid (revoked)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);

      // Step 4: Verify refresh token is also invalid
      await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken,
        })
        .expect(401);

      // Step 5: Verify can login with new password
      const newLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'NewPassword123',
        })
        .expect(200);

      expect(newLoginResponse.body.success).toBe(true);
      expect(newLoginResponse.body.data.tokens.accessToken).toBeDefined();

      // Step 6: Verify new token works
      const newAccessToken = newLoginResponse.body.data.tokens.accessToken;
      const profileResponse2 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      expect(profileResponse2.body.data.user.email).toBe(testUser.email);

      // Step 7: Verify cannot login with old password
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123',
        })
        .expect(401);
    });

    it('should reject password change with incorrect current password', async () => {
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(401);

      // Verify token still works after failed password change
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should reject password change with same password', async () => {
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'TestPassword123',
        })
        .expect(400);

      // Verify token still works after failed password change
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should reject password change with invalid new password format', async () => {
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'weak',
        })
        .expect(400);

      // Verify token still works after failed password change
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should reject password change without authentication', async () => {
      await request(app)
        .put('/api/auth/password')
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(401);
    });
  });

  describe('Token Version Verification', () => {
    it('should increment token version after password change', async () => {
      // Get initial user state
      const initialUser = await container.userRepository.findById(testUser.id);
      const initialTokenVersion = initialUser!.tokenVersion;

      // Change password
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(200);

      // Verify token version was incremented
      const updatedUser = await container.userRepository.findById(testUser.id);
      expect(updatedUser!.tokenVersion).toBe(initialTokenVersion + 1);
    });

    it('should reject tokens with old token version after password change', async () => {
      // Create a second user to test token isolation
      const hashedPassword = await passwordService.hash('TestPassword123');
      const testUser2 = User.create({
        username: 'testuser2',
        email: 'test2@example.com',
        password: hashedPassword,
      });
      await container.userRepository.create(testUser2);

      // Login both users
      const loginResponse1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123',
        })
        .expect(200);

      const loginResponse2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser2.email,
          password: 'TestPassword123',
        })
        .expect(200);

      const token1 = loginResponse1.body.data.tokens.accessToken;
      const token2 = loginResponse2.body.data.tokens.accessToken;

      // Verify both tokens work
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      // Change password for user 1
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'NewPassword123',
        })
        .expect(200);

      // Verify user 1's token is now invalid
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token1}`)
        .expect(401);

      // Verify user 2's token still works (token revocation is per-user)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      // Cleanup
      await container.userRepository.delete(testUser2.id);
    });
  });
});
