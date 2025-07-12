import { User } from '@domain/entities/User';

describe('User Entity', () => {
  const mockUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword123',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  describe('create', () => {
    it('should create a new user with default values', () => {
      const user = User.create(mockUserData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(mockUserData.username);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.avatarUrl).toBe(mockUserData.avatarUrl);
      expect(user.isActive).toBe(true);
      expect(user.isOnline).toBe(false);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with default avatar if not provided', () => {
      const userDataWithoutAvatar = {
        username: mockUserData.username,
        email: mockUserData.email,
        password: mockUserData.password,
      };

      const user = User.create(userDataWithoutAvatar);

      expect(user.avatarUrl).toBeDefined();
      expect(user.avatarUrl).toContain('dicebear.com');
    });
  });

  describe('business methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create(mockUserData);
    });

    it('should update profile correctly', async () => {
      const newUsername = 'newusername';
      const newAvatarUrl = 'https://example.com/new-avatar.jpg';
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      user.updateProfile(newUsername, newAvatarUrl);

      expect(user.username).toBe(newUsername);
      expect(user.avatarUrl).toBe(newAvatarUrl);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should change password correctly', async () => {
      const newPassword = 'newhashedpassword123';
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1));

      user.changePassword(newPassword);

      expect(user.password).toBe(newPassword);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should set online status correctly', () => {
      expect(user.isOnline).toBe(false);

      user.setOnlineStatus(true);
      expect(user.isOnline).toBe(true);

      user.setOnlineStatus(false);
      expect(user.isOnline).toBe(false);
    });

    it('should set and validate OTP correctly', () => {
      const otp = '123456';
      
      user.setOTP(otp, 120);

      expect(user.otp).toBe(otp);
      expect(user.otpExpiresAt).toBeInstanceOf(Date);
      expect(user.isOTPValid(otp)).toBe(true);
      expect(user.isOTPValid('wrong')).toBe(false);
    });

    it('should clear OTP correctly', () => {
      user.setOTP('123456', 120);
      expect(user.otp).toBeDefined();

      user.clearOTP();
      expect(user.otp).toBeUndefined();
      expect(user.otpExpiresAt).toBeUndefined();
    });

    it('should activate and deactivate user correctly', () => {
      expect(user.isActive).toBe(true);

      user.deactivate();
      expect(user.isActive).toBe(false);

      user.activate();
      expect(user.isActive).toBe(true);
    });
  });

  describe('toJSON methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create(mockUserData);
    });

    it('should return complete user data with toJSON', () => {
      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('username');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('password');
      expect(json).toHaveProperty('avatarUrl');
      expect(json).toHaveProperty('isActive');
      expect(json).toHaveProperty('isOnline');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    it('should return public user data with toPublicJSON', () => {
      const publicJson = user.toPublicJSON();

      expect(publicJson).toHaveProperty('id');
      expect(publicJson).toHaveProperty('username');
      expect(publicJson).toHaveProperty('email');
      expect(publicJson).toHaveProperty('avatarUrl');
      expect(publicJson).toHaveProperty('isActive');
      expect(publicJson).toHaveProperty('isOnline');
      expect(publicJson).toHaveProperty('createdAt');
      expect(publicJson).toHaveProperty('updatedAt');
      
      // Should not have sensitive data
      expect(publicJson).not.toHaveProperty('password');
      expect(publicJson).not.toHaveProperty('otp');
      expect(publicJson).not.toHaveProperty('otpExpiresAt');
    });
  });
});
