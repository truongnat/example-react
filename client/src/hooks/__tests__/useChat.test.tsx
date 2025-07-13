import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useRooms,
  useRoom,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useJoinRoom,
  useLeaveRoom,
  useInviteUsers,
  useRoomMembers,
  useRemoveMember,
  useMessages,
  useUpdateMessage,
  useDeleteMessage,
} from '../useChat'
import { chatService } from '@/services/chat.service'
import { mockRoom, mockMessage, mockUser } from '@/test/test-utils'

// Mock dependencies
vi.mock('@/services/chat.service', () => ({
  chatService: {
    getRooms: vi.fn(),
    getRoom: vi.fn(),
    createRoom: vi.fn(),
    updateRoom: vi.fn(),
    deleteRoom: vi.fn(),
    joinRoom: vi.fn(),
    leaveRoom: vi.fn(),
    inviteUsers: vi.fn(),
    getRoomMembers: vi.fn(),
    removeMember: vi.fn(),
    getMessages: vi.fn(),
    updateMessage: vi.fn(),
    deleteMessage: vi.fn(),
  },
}))

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useChat hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useRooms', () => {
    it('should fetch rooms with default parameters', async () => {
      const mockResponse = {
        rooms: [mockRoom],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      vi.mocked(chatService.getRooms).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useRooms(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getRooms).toHaveBeenCalledWith(1, 10, 'updated_at', 'desc')
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should fetch rooms with custom parameters', async () => {
      const mockResponse = {
        rooms: [mockRoom],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      }

      vi.mocked(chatService.getRooms).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useRooms(2, 5, 'name', 'asc'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getRooms).toHaveBeenCalledWith(2, 5, 'name', 'asc')
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useRoom', () => {
    it('should fetch room by id', async () => {
      vi.mocked(chatService.getRoom).mockResolvedValue(mockRoom)

      const { result } = renderHook(() => useRoom('room-123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getRoom).toHaveBeenCalledWith('room-123')
      expect(result.current.data).toEqual(mockRoom)
    })

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useRoom(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(chatService.getRoom).not.toHaveBeenCalled()
    })
  })

  describe('useCreateRoom', () => {
    it('should create room successfully', async () => {
      vi.mocked(chatService.createRoom).mockResolvedValue(mockRoom)

      const { result } = renderHook(() => useCreateRoom(), {
        wrapper: createWrapper(),
      })

      const createData = {
        name: 'New Room',
        avatarUrl: 'https://example.com/room.jpg',
      }

      result.current.mutate(createData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.createRoom).toHaveBeenCalledWith(createData)
      expect(result.current.data).toEqual(mockRoom)
    })
  })

  describe('useUpdateRoom', () => {
    it('should update room successfully', async () => {
      const updatedRoom = { ...mockRoom, name: 'Updated Room' }
      vi.mocked(chatService.updateRoom).mockResolvedValue(updatedRoom)

      const { result } = renderHook(() => useUpdateRoom('room-123'), {
        wrapper: createWrapper(),
      })

      const updateData = { name: 'Updated Room' }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.updateRoom).toHaveBeenCalledWith('room-123', { name: 'Updated Room' })
      expect(result.current.data).toEqual(updatedRoom)
    })
  })

  describe('useDeleteRoom', () => {
    it('should delete room successfully', async () => {
      vi.mocked(chatService.deleteRoom).mockResolvedValue()

      const { result } = renderHook(() => useDeleteRoom(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('room-123')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.deleteRoom).toHaveBeenCalledWith('room-123')
    })
  })

  describe('useJoinRoom', () => {
    it('should join room successfully', async () => {
      vi.mocked(chatService.joinRoom).mockResolvedValue(mockRoom)

      const { result } = renderHook(() => useJoinRoom(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('room-123')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.joinRoom).toHaveBeenCalledWith('room-123')
      expect(result.current.data).toEqual(mockRoom)
    })
  })

  describe('useLeaveRoom', () => {
    it('should leave room successfully', async () => {
      vi.mocked(chatService.leaveRoom).mockResolvedValue()

      const { result } = renderHook(() => useLeaveRoom(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('room-123')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.leaveRoom).toHaveBeenCalledWith('room-123')
    })
  })

  describe('useInviteUsers', () => {
    it('should invite users successfully', async () => {
      const inviteResponse = {
        invitedUsers: ['user-456'],
        alreadyMembers: [],
        notFound: [],
      }

      vi.mocked(chatService.inviteUsers).mockResolvedValue(inviteResponse)

      const { result } = renderHook(() => useInviteUsers(), {
        wrapper: createWrapper(),
      })

      const inviteData = {
        roomId: 'room-123',
        userIds: ['user-456'],
      }

      result.current.mutate(inviteData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.inviteUsers).toHaveBeenCalledWith('room-123', ['user-456'])
      expect(result.current.data).toEqual(inviteResponse)
    })
  })

  describe('useRoomMembers', () => {
    it('should fetch room members', async () => {
      const membersResponse = {
        members: [mockUser],
        totalMembers: 1,
        roomInfo: { id: 'room-123', name: 'Test Room', authorId: 'user-123', createdAt: '2025-01-01' },
      }

      vi.mocked(chatService.getRoomMembers).mockResolvedValue(membersResponse)

      const { result } = renderHook(() => useRoomMembers('room-123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getRoomMembers).toHaveBeenCalledWith('room-123')
      expect(result.current.data).toEqual(membersResponse)
    })

    it('should not fetch when roomId is empty', () => {
      const { result } = renderHook(() => useRoomMembers(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(chatService.getRoomMembers).not.toHaveBeenCalled()
    })
  })

  describe('useRemoveMember', () => {
    it('should remove member successfully', async () => {
      vi.mocked(chatService.removeMember).mockResolvedValue()

      const { result } = renderHook(() => useRemoveMember(), {
        wrapper: createWrapper(),
      })

      const removeData = {
        roomId: 'room-123',
        memberId: 'user-456',
      }

      result.current.mutate(removeData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.removeMember).toHaveBeenCalledWith('room-123', 'user-456')
    })
  })

  describe('useMessages', () => {
    it('should fetch messages with default parameters', async () => {
      const messagesResponse = {
        messages: [mockMessage],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      }

      vi.mocked(chatService.getMessages).mockResolvedValue(messagesResponse)

      const { result } = renderHook(() => useMessages('room-123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getMessages).toHaveBeenCalledWith('room-123', 1, 50)
      expect(result.current.data).toEqual(messagesResponse)
    })

    it('should fetch messages with custom parameters', async () => {
      const messagesResponse = {
        messages: [mockMessage],
        total: 1,
        page: 2,
        limit: 20,
        totalPages: 1,
      }

      vi.mocked(chatService.getMessages).mockResolvedValue(messagesResponse)

      const { result } = renderHook(() => useMessages('room-123', 2, 20), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.getMessages).toHaveBeenCalledWith('room-123', 2, 20)
      expect(result.current.data).toEqual(messagesResponse)
    })

    it('should not fetch when roomId is empty', () => {
      const { result } = renderHook(() => useMessages(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(chatService.getMessages).not.toHaveBeenCalled()
    })
  })

  describe('useUpdateMessage', () => {
    it('should update message successfully', async () => {
      const updatedMessage = { ...mockMessage, content: 'Updated content' }
      vi.mocked(chatService.updateMessage).mockResolvedValue(updatedMessage)

      const { result } = renderHook(() => useUpdateMessage('room-123'), {
        wrapper: createWrapper(),
      })

      const updateData = {
        messageId: 'message-123',
        data: { content: 'Updated content' },
      }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.updateMessage).toHaveBeenCalledWith('room-123', 'message-123', { content: 'Updated content' })
      expect(result.current.data).toEqual(updatedMessage)
    })
  })

  describe('useDeleteMessage', () => {
    it('should delete message successfully', async () => {
      vi.mocked(chatService.deleteMessage).mockResolvedValue()

      const { result } = renderHook(() => useDeleteMessage('room-123'), {
        wrapper: createWrapper(),
      })

      const messageId = 'message-123'

      result.current.mutate(messageId)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(chatService.deleteMessage).toHaveBeenCalledWith('room-123', 'message-123')
    })
  })
})
