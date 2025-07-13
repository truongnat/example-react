import { describe, it, expect, vi, beforeEach } from 'vitest'
import { chatService } from '../chat.service'
import { httpClient } from '@/lib/http-client'
import { mockApiResponse, mockRoom, mockMessage, mockUser } from '@/test/test-utils'
import type { CreateRoomRequest, UpdateRoomRequest, UpdateMessageRequest } from '../chat.service'

// Mock the http client
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('ChatService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRooms', () => {
    it('should get rooms with default parameters', async () => {
      const mockResponse = mockApiResponse({
        rooms: [mockRoom],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRooms()

      expect(httpClient.get).toHaveBeenCalledWith(
        '/chat/rooms?page=1&limit=10&sortBy=updated_at&sortOrder=desc'
      )
      expect(result).toEqual({
        rooms: [mockRoom],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })
    })

    it('should get rooms with custom parameters', async () => {
      const mockResponse = mockApiResponse({
        rooms: [mockRoom],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      })

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRooms(2, 5, 'name', 'asc')

      expect(httpClient.get).toHaveBeenCalledWith(
        '/chat/rooms?page=2&limit=5&sortBy=name&sortOrder=asc'
      )
      expect(result).toEqual({
        rooms: [mockRoom],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      })
    })

    it('should return default response when no data', async () => {
      const mockResponse = mockApiResponse(null)

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRooms()

      expect(result).toEqual({
        rooms: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      })
    })
  })

  describe('getRoom', () => {
    it('should get room by id successfully', async () => {
      const mockResponse = mockApiResponse({ room: mockRoom })
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRoom('room-123')

      expect(httpClient.get).toHaveBeenCalledWith('/chat/rooms/room-123')
      expect(result).toEqual(mockRoom)
    })

    it('should return default room when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRoom('room-123')

      expect(result).toEqual({})
    })
  })

  describe('createRoom', () => {
    const createRoomData: CreateRoomRequest = {
      name: 'New Room',
      avatarUrl: 'https://example.com/room.jpg',
    }

    it('should create room successfully', async () => {
      const mockResponse = mockApiResponse({ room: mockRoom })
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await chatService.createRoom(createRoomData)

      expect(httpClient.post).toHaveBeenCalledWith('/chat/rooms', createRoomData)
      expect(result).toEqual(mockRoom)
    })

    it('should return default room when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await chatService.createRoom(createRoomData)

      expect(result).toEqual({})
    })
  })

  describe('updateRoom', () => {
    const updateRoomData: UpdateRoomRequest = {
      name: 'Updated Room',
      avatarUrl: 'https://example.com/updated-room.jpg',
    }

    it('should update room successfully', async () => {
      const updatedRoom = { ...mockRoom, name: 'Updated Room' }
      const mockResponse = mockApiResponse({ room: updatedRoom })
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await chatService.updateRoom('room-123', updateRoomData)

      expect(httpClient.put).toHaveBeenCalledWith('/chat/rooms/room-123', updateRoomData)
      expect(result).toEqual(updatedRoom)
    })

    it('should return default room when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await chatService.updateRoom('room-123', updateRoomData)

      expect(result).toEqual({})
    })
  })

  describe('deleteRoom', () => {
    it('should delete room successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(chatService.deleteRoom('room-123')).resolves.not.toThrow()

      expect(httpClient.delete).toHaveBeenCalledWith('/chat/rooms/room-123')
    })
  })

  describe('joinRoom', () => {
    it('should join room successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(chatService.joinRoom('room-123')).resolves.not.toThrow()

      expect(httpClient.post).toHaveBeenCalledWith('/chat/rooms/room-123/join')
    })
  })

  describe('leaveRoom', () => {
    it('should leave room successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(chatService.leaveRoom('room-123')).resolves.not.toThrow()

      expect(httpClient.post).toHaveBeenCalledWith('/chat/rooms/room-123/leave')
    })
  })

  describe('inviteUsers', () => {
    it('should invite users successfully', async () => {
      const inviteResponse = {
        invitedUsers: ['user-456'],
        alreadyMembers: [],
        notFound: [],
      }
      const mockResponse = mockApiResponse(inviteResponse)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await chatService.inviteUsers('room-123', ['user-456'])

      expect(httpClient.post).toHaveBeenCalledWith('/chat/rooms/room-123/invite', {
        userIds: ['user-456'],
      })
      expect(result).toEqual(inviteResponse)
    })

    it('should return default response when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await chatService.inviteUsers('room-123', ['user-456'])

      expect(result).toEqual({
        invitedUsers: [],
        alreadyMembers: [],
        notFound: [],
      })
    })
  })

  describe('getRoomMembers', () => {
    it('should get room members successfully', async () => {
      const membersResponse = {
        members: [mockUser],
        totalMembers: 1,
        roomInfo: { id: 'room-123', name: 'Test Room', authorId: 'user-123', createdAt: '2025-01-01' },
      }
      const mockResponse = mockApiResponse(membersResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRoomMembers('room-123')

      expect(httpClient.get).toHaveBeenCalledWith('/chat/rooms/room-123/members')
      expect(result).toEqual(membersResponse)
    })

    it('should return default response when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getRoomMembers('room-123')

      expect(result).toEqual({
        members: [],
        totalMembers: 0,
        roomInfo: { id: '', name: '', authorId: '', createdAt: '' },
      })
    })
  })

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(chatService.removeMember('room-123', 'user-456')).resolves.not.toThrow()

      expect(httpClient.delete).toHaveBeenCalledWith('/chat/rooms/room-123/members/user-456')
    })
  })

  describe('getMessages', () => {
    it('should get messages with default parameters', async () => {
      const messagesResponse = {
        messages: [mockMessage],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      }
      const mockResponse = mockApiResponse(messagesResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getMessages('room-123')

      expect(httpClient.get).toHaveBeenCalledWith('/chat/rooms/room-123/messages?page=1&limit=50')
      expect(result).toEqual(messagesResponse)
    })

    it('should get messages with custom parameters', async () => {
      const messagesResponse = {
        messages: [mockMessage],
        total: 1,
        page: 2,
        limit: 20,
        totalPages: 1,
      }
      const mockResponse = mockApiResponse(messagesResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getMessages('room-123', 2, 20)

      expect(httpClient.get).toHaveBeenCalledWith('/chat/rooms/room-123/messages?page=2&limit=20')
      expect(result).toEqual(messagesResponse)
    })

    it('should return default response when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await chatService.getMessages('room-123')

      expect(result).toEqual({
        messages: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      })
    })
  })

  describe('updateMessage', () => {
    const updateMessageData: UpdateMessageRequest = {
      content: 'Updated message content',
    }

    it('should update message successfully', async () => {
      const updatedMessage = { ...mockMessage, content: 'Updated message content' }
      const mockResponse = mockApiResponse({ message: updatedMessage })
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await chatService.updateMessage('room-123', 'message-123', updateMessageData)

      expect(httpClient.put).toHaveBeenCalledWith(
        '/chat/rooms/room-123/messages/message-123',
        updateMessageData
      )
      expect(result).toEqual(updatedMessage)
    })

    it('should return default message when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await chatService.updateMessage('room-123', 'message-123', updateMessageData)

      expect(result).toEqual({})
    })
  })

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(chatService.deleteMessage('room-123', 'message-123')).resolves.not.toThrow()

      expect(httpClient.delete).toHaveBeenCalledWith('/chat/rooms/room-123/messages/message-123')
    })
  })
})
