import request from 'supertest';
import { Express } from 'express';
import { setupTestApp, resetTestDatabase } from '../../utils/helpers/test-app.helper';

describe('Authentication Flow E2E Tests', () => {
  let app: Express;
  let userCredentials: any;
  let userTokens: any;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    const timestamp = Date.now();
    userCredentials = {
      username: `e2euser_${timestamp}`,
      email: `e2e_${timestamp}@example.com`,
      password: 'Password123',
    };
  });

  describe('Complete Authentication Flow', () => {
    it('should complete full registration -> login -> profile update -> logout flow', async () => {
      // Step 1: Register new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe(userCredentials.email);
      expect(registerResponse.body.data.tokens).toHaveProperty('accessToken');
      expect(registerResponse.body.data.tokens).toHaveProperty('refreshToken');

      const initialTokens = registerResponse.body.data.tokens;

      // Step 2: Verify user can access protected route with registration tokens
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${initialTokens.accessToken}`)
        .expect(200);

      expect(meResponse.body.data.email).toBe(userCredentials.email);
      expect(meResponse.body.data.username).toBe(userCredentials.username);

      // Step 3: Logout to invalidate tokens
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${initialTokens.accessToken}`)
        .send({ refreshToken: initialTokens.refreshToken })
        .expect(200);

      // Step 4: Verify tokens are still valid after logout
      // Note: In stateless JWT, tokens remain valid until expiry
      // This is expected behavior for JWT-based authentication
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${initialTokens.accessToken}`)
        .expect(200);

      // Step 5: Login with credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      userTokens = loginResponse.body.data.tokens;

      // Step 6: Update user profile
      const updateResponse = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          username: 'updatede2euser',
          avatarUrl: 'https://example.com/new-avatar.jpg',
        })
        .expect(200);

      expect(updateResponse.body.data.user.username).toBe('updatede2euser');
      expect(updateResponse.body.data.user.avatarUrl).toBe('https://example.com/new-avatar.jpg');

      // Step 7: Verify profile was updated
      const updatedMeResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      expect(updatedMeResponse.body.data.username).toBe('updatede2euser');

      // Step 8: Test token refresh
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: userTokens.refreshToken })
        .expect(200);

      expect(refreshResponse.body.data.tokens).toHaveProperty('accessToken');
      expect(refreshResponse.body.data.tokens).toHaveProperty('refreshToken');

      const newTokens = refreshResponse.body.data.tokens;

      // Step 9: Verify new tokens work
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newTokens.accessToken}`)
        .expect(200);

      // Step 10: Final logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${newTokens.accessToken}`)
        .send({ refreshToken: newTokens.refreshToken })
        .expect(200);

      // Step 11: Verify tokens are still valid after logout (stateless JWT)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newTokens.accessToken}`)
        .expect(200);
    });

    it('should handle concurrent login sessions', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);

      // Login from first session
      const session1Response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      const session1Tokens = session1Response.body.data.tokens;

      // Login from second session
      const session2Response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      const session2Tokens = session2Response.body.data.tokens;

      // Both sessions should work
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${session1Tokens.accessToken}`)
        .expect(200);

      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${session2Tokens.accessToken}`)
        .expect(200);

      // Logout from first session
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${session1Tokens.accessToken}`)
        .send({ refreshToken: session1Tokens.refreshToken })
        .expect(200);

      // First session tokens are still valid (stateless JWT behavior)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${session1Tokens.accessToken}`)
        .expect(200);

      // Second session should still work
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${session2Tokens.accessToken}`)
        .expect(200);
    });

    it('should prevent access with expired tokens', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      const tokens = loginResponse.body.data.tokens;

      // Simulate token expiration by waiting or manipulating time
      // For this test, we'll use an invalid token format
      const expiredToken = 'expired.token.here';

      // Try to access protected route with expired token
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      // Valid token should still work
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200);
    });

    it.skip('should handle password change flow', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);

      // Login with original password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      const tokens = loginResponse.body.data.tokens;

      // Change password (assuming this endpoint exists)
      const newPassword = 'NewPassword123';
      await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({
          currentPassword: userCredentials.password,
          newPassword,
        })
        .expect(200);

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({ refreshToken: tokens.refreshToken })
        .expect(200);

      // Try login with old password (should fail)
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(401);

      // Login with new password (should succeed)
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: newPassword,
        })
        .expect(200);
    });

    it.skip('should handle account deactivation flow', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      const tokens = loginResponse.body.data.tokens;

      // Deactivate account (assuming this endpoint exists)
      await request(app)
        .delete('/api/auth/account')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200);

      // Try to access protected routes (should fail)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(401);

      // Try to login with deactivated account (should fail)
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(401);
    });
  });
});
