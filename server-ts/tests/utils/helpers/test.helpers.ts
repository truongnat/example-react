import { Request, Response } from 'express';
import { UUID } from '@shared/types/common.types';

// Mock Express Request
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined,
  ...overrides,
});

// Mock Express Response
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res;
};

// Mock Next Function
export const createMockNext = (): jest.Mock => jest.fn();

// Generate test UUID
export const generateTestUUID = (): UUID => {
  return `test-uuid-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate multiple test UUIDs
export const generateTestUUIDs = (count: number): UUID[] => {
  return Array.from({ length: count }, () => generateTestUUID());
};

// Create authenticated request
export const createAuthenticatedRequest = (userId: UUID, overrides: Partial<Request> = {}): Partial<Request> => ({
  ...createMockRequest(overrides),
  user: {
    id: userId,
    email: 'test@example.com',
    username: 'testuser'
  },
});

// Wait for async operations
export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Assert error type and message
export const expectError = (error: any, expectedType: any, expectedMessage?: string) => {
  expect(error).toBeInstanceOf(expectedType);
  if (expectedMessage) {
    expect(error.message).toContain(expectedMessage);
  }
};

// Create pagination options
export const createPaginationOptions = (page: number = 1, limit: number = 10) => ({
  page,
  limit,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
});

// Create paginated result
export const createPaginatedResult = <T>(data: T[], page: number = 1, limit: number = 10, total?: number) => ({
  data,
  total: total ?? data.length,
  page,
  limit,
  totalPages: Math.ceil((total ?? data.length) / limit),
});

// Mock Date.now for consistent testing
export const mockDateNow = (timestamp: number) => {
  const originalDateNow = Date.now;
  Date.now = jest.fn(() => timestamp);
  return () => {
    Date.now = originalDateNow;
  };
};

// Create test date
export const createTestDate = (daysFromNow: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Clean up test data
export const cleanupTestData = async (cleanupFunctions: Array<() => Promise<void>>) => {
  for (const cleanup of cleanupFunctions) {
    try {
      await cleanup();
    } catch (error) {
      console.warn('Cleanup function failed:', error);
    }
  }
};
