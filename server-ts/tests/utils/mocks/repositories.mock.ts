import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IMessageRepository } from '@domain/repositories/IMessageRepository';

// Mock User Repository
export const createMockUserRepository = (): jest.Mocked<IUserRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  findAll: jest.fn(),
  findActiveUsers: jest.fn(),
  findOnlineUsers: jest.fn(),
  searchUsers: jest.fn(),
  update: jest.fn(),
  updateOnlineStatus: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  exists: jest.fn(),
  existsByEmail: jest.fn(),
  existsByUsername: jest.fn(),
  count: jest.fn(),
});

// Mock Todo Repository
export const createMockTodoRepository = (): jest.Mocked<ITodoRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByStatus: jest.fn(),
  findByUserIdAndStatus: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  existsByUserIdAndTitle: jest.fn(),
  count: jest.fn(),
  countByUserId: jest.fn(),
  countByStatus: jest.fn(),
  countByUserIdAndStatus: jest.fn(),
});

// Mock Room Repository
export const createMockRoomRepository = (): jest.Mocked<IRoomRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByAuthorId: jest.fn(),
  findByParticipant: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn(),
  updateLastMessage: jest.fn(),
  exists: jest.fn(),
  existsByName: jest.fn(),
  isParticipant: jest.fn(),
  count: jest.fn(),
  countByAuthorId: jest.fn(),
});

// Mock Message Repository
export const createMockMessageRepository = (): jest.Mocked<IMessageRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByRoomId: jest.fn(),
  findByAuthorId: jest.fn(),
  findByRoomIdAndAuthorId: jest.fn(),
  findVisibleByRoomId: jest.fn(),
  findLatestByRoomId: jest.fn(),
  update: jest.fn(),
  markAsDeleted: jest.fn(),
  restore: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  count: jest.fn(),
  countByRoomId: jest.fn(),
  countByAuthorId: jest.fn(),
  countVisibleByRoomId: jest.fn(),
});
