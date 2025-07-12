import { UpdateUserUseCase } from "@application/use-cases/auth/UpdateUserUseCase"
import { User } from "@domain/entities"
import { IUserRepository } from "@domain/repositories"
import { ConflictException, NotFoundException } from "@shared/exceptions"

// Mock the user repository
const mockUserRepository: jest.Mocked<IUserRepository> = {
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
}

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase
  let mockUser: User

  beforeEach(() => {
    updateUserUseCase = new UpdateUserUseCase(mockUserRepository)

    // Create a mock user
    mockUser = User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      avatarUrl: 'https://example.com/avatar.jpg'
    })

    // Reset all mocks
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should successfully update username', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'newusername' }

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.findByUsername.mockResolvedValue(null) // No conflict
      mockUserRepository.update.mockResolvedValue(mockUser)

      const result = await updateUserUseCase.execute(userId, updateData)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('newusername')
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser)
      expect(result.user).toBeDefined()
    })

    it('should successfully update avatar URL', async () => {
      const userId = 'user-id-123'
      const updateData = { avatarUrl: 'https://new-avatar.com/image.jpg' }

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.update.mockResolvedValue(mockUser)

      const result = await updateUserUseCase.execute(userId, updateData)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser)
      expect(result.user).toBeDefined()
    })

    it('should successfully update both username and avatar URL', async () => {
      const userId = 'user-id-123'
      const updateData = {
        username: 'newusername',
        avatarUrl: 'https://new-avatar.com/image.jpg'
      }

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.findByUsername.mockResolvedValue(null)
      mockUserRepository.update.mockResolvedValue(mockUser)

      const result = await updateUserUseCase.execute(userId, updateData)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('newusername')
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser)
      expect(result.user).toBeDefined()
    })

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 'non-existent-user'
      const updateData = { username: 'newusername' }

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow(NotFoundException)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundException when user is inactive', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'newusername' }

      mockUser.deactivate() // Make user inactive
      mockUserRepository.findById.mockResolvedValue(mockUser)

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException when username already exists', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'existingusername' }

      const existingUser = User.create({
        username: 'existingusername',
        email: 'other@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg'
      })

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.findByUsername.mockResolvedValue(existingUser)

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow(ConflictException)

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('existingusername')
    })

    it('should allow updating to same username', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'testuser' } // Same as current username

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.update.mockResolvedValue(mockUser)

      const result = await updateUserUseCase.execute(userId, updateData)

      expect(mockUserRepository.findByUsername).not.toHaveBeenCalled()
      expect(result.user).toBeDefined()
    })
  })

  describe('validation', () => {
    it('should throw error when no fields provided', async () => {
      const userId = 'user-id-123'
      const updateData = {}

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow('At least one field must be provided for update')
    })

    it('should throw error for invalid username - too short', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'ab' }

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow('Username must be at least 3 characters long')
    })

    it('should throw error for invalid username - too long', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'a'.repeat(51) }

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow('Username must be less than 50 characters')
    })

    it('should throw error for invalid username - invalid characters', async () => {
      const userId = 'user-id-123'
      const updateData = { username: 'invalid username!' }

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow('Username can only contain letters, numbers, underscores, and hyphens')
    })

    it('should throw error for invalid avatar URL', async () => {
      const userId = 'user-id-123'
      const updateData = { avatarUrl: 'invalid-url' }

      await expect(updateUserUseCase.execute(userId, updateData))
        .rejects.toThrow('Avatar URL must be a valid URL')
    })

    it('should allow empty avatar URL', async () => {
      const userId = 'user-id-123'
      const updateData = { avatarUrl: '' }

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.update.mockResolvedValue(mockUser)

      const result = await updateUserUseCase.execute(userId, updateData)
      expect(result.user).toBeDefined()
    })

    it('should accept valid usernames', async () => {
      const validUsernames = [
        'user123',
        'user_name',
        'user-name',
        'User123',
        'a'.repeat(3), // minimum length
        'a'.repeat(50), // maximum length
      ]

      for (const username of validUsernames) {
        mockUserRepository.findById.mockResolvedValue(mockUser)
        mockUserRepository.findByUsername.mockResolvedValue(null)
        mockUserRepository.update.mockResolvedValue(mockUser)

        const result = await updateUserUseCase.execute('user-id-123', { username })
        expect(result.user).toBeDefined()
      }
    })

    it('should accept valid avatar URLs', async () => {
      const validUrls = [
        'https://example.com/avatar.jpg',
        'http://example.com/avatar.png',
        'https://cdn.example.com/images/avatar.gif',
      ]

      for (const avatarUrl of validUrls) {
        mockUserRepository.findById.mockResolvedValue(mockUser)
        mockUserRepository.update.mockResolvedValue(mockUser)

        const result = await updateUserUseCase.execute('user-id-123', { avatarUrl })
        expect(result.user).toBeDefined()
      }
    })
  })
})
