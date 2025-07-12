import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { IEmailService } from '@application/interfaces/IEmailService';

// Mock Password Service
export const createMockPasswordService = (): jest.Mocked<IPasswordService> => ({
  hash: jest.fn(),
  compare: jest.fn(),
  generate: jest.fn(),
});

// Mock Token Service
export const createMockTokenService = (): jest.Mocked<ITokenService> => ({
  generateTokenPair: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  refreshTokens: jest.fn(),
});

// Mock Email Service
export const createMockEmailService = (): jest.Mocked<IEmailService> => ({
  sendEmail: jest.fn(),
  sendOTPEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
});

// Mock Socket Service
export const createMockSocketService = () => ({
  emitToRoom: jest.fn(),
  emitToUser: jest.fn(),
  joinRoom: jest.fn(),
  leaveRoom: jest.fn(),
  broadcast: jest.fn(),
  getConnectedUsers: jest.fn(),
  getUserSocketIds: jest.fn(),
});
