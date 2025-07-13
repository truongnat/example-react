import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { socketService } from '../socket.service'
import { useAuthStore } from '@/stores/authStore'
import { mockSocket } from '@/test/mocks/socket.io-client'
import { mockUser, mockAuthTokens, mockMessage, mockRoom } from '@/test/test-utils'

// Mock socket.io-client
vi.mock('socket.io-client', async () => {
  const actual = await vi.importActual('@/test/mocks/socket.io-client')
  return actual
})

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}))

// Mock config
vi.mock('@/lib/config', () => ({
  config: {
    socketUrl: 'http://localhost:8080',
  },
}))

describe('SocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSocket._reset()

    // Reset socket service state
    socketService.reset()

    // Mock auth store state
    vi.mocked(useAuthStore.getState).mockReturnValue({
      user: mockUser,
      tokens: mockAuthTokens,
      isAuthenticated: true,
    } as any)
  })

  afterEach(() => {
    // Reset socket service to ensure clean state
    socketService.reset()
  })

  describe('connect', () => {
    it('should connect successfully with valid token', async () => {
      const connectPromise = socketService.connect()
      
      // Simulate successful connection
      mockSocket._simulateConnect()
      
      await expect(connectPromise).resolves.not.toThrow()
      expect(socketService.isConnected).toBe(true)
    })

    it('should reject when no token available', async () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({
        user: null,
        tokens: null,
        isAuthenticated: false,
      } as any)

      await expect(socketService.connect()).rejects.toThrow('No authentication token available')
    })

    it('should handle connection timeout', async () => {
      // Mock a timeout scenario by not calling _simulateConnect
      const connectPromise = socketService.connect()

      // Simulate timeout by rejecting after a short delay
      setTimeout(() => {
        mockSocket._simulateEvent('connect_error', new Error('Connection timeout'))
      }, 10)

      await expect(connectPromise).rejects.toThrow('Connection timeout')
    })

    it('should handle connection error', async () => {
      const connectPromise = socketService.connect()
      
      // Simulate connection error
      mockSocket._simulateEvent('connect_error', new Error('Connection failed'))
      
      await expect(connectPromise).rejects.toThrow('Connection failed')
    })

    it('should not create multiple connections', async () => {
      const connectPromise1 = socketService.connect()
      const connectPromise2 = socketService.connect()
      
      mockSocket._simulateConnect()
      
      await Promise.all([connectPromise1, connectPromise2])
      
      // Should use the same connection promise
      expect(connectPromise1).toBe(connectPromise2)
    })
  })

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      const connectPromise = socketService.connect()
      mockSocket._simulateConnect()
      await connectPromise

      socketService.disconnect()

      expect(mockSocket.removeAllListeners).toHaveBeenCalled()
      expect(mockSocket.disconnect).toHaveBeenCalled()
      expect(socketService.isConnected).toBe(false)
    })

    it('should handle disconnect when not connected', () => {
      expect(() => socketService.disconnect()).not.toThrow()
    })
  })

  describe('event listeners', () => {
    beforeEach(async () => {
      const connectPromise = socketService.connect()
      // Simulate connection immediately
      mockSocket._simulateConnect()
      await connectPromise
    })

    it('should register message listener', () => {
      const callback = vi.fn()
      socketService.onNewMessage(callback)

      // Socket service expects { message: MessageData; roomId: string } format
      mockSocket._simulateEvent('new-message', { message: mockMessage, roomId: 'room-123' })

      expect(callback).toHaveBeenCalledWith(mockMessage)
    })

    it('should register room update listener', () => {
      const callback = vi.fn()
      socketService.onRoomUpdated(callback)

      mockSocket._simulateEvent('room-updated', mockRoom)

      expect(callback).toHaveBeenCalledWith(mockRoom)
    })

    it('should register typing listener', () => {
      const callback = vi.fn()
      const typingData = {
        userId: 'user-456',
        username: 'otheruser',
        roomId: 'room-123',
        isTyping: true,
      }
      
      socketService.onTyping(callback)
      
      mockSocket._simulateEvent('user-typing', typingData)
      
      expect(callback).toHaveBeenCalledWith(typingData)
    })

    it('should register user joined listener', () => {
      const callback = vi.fn()
      const userJoinedData = {
        userId: 'user-456',
        username: 'newuser',
        roomId: 'room-123',
      }
      
      socketService.onUserJoined(callback)
      
      mockSocket._simulateEvent('user-joined', userJoinedData)
      
      expect(callback).toHaveBeenCalledWith(userJoinedData)
    })

    it('should register user left listener', () => {
      const callback = vi.fn()
      const userLeftData = {
        userId: 'user-456',
        username: 'leftuser',
        roomId: 'room-123',
      }
      
      socketService.onUserLeft(callback)
      
      mockSocket._simulateEvent('user-left', userLeftData)
      
      expect(callback).toHaveBeenCalledWith(userLeftData)
    })

    it('should remove all listeners when reset', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      socketService.onNewMessage(callback1)
      socketService.onTyping(callback2)

      socketService.reset()

      expect(mockSocket.removeAllListeners).toHaveBeenCalled()
    })
  })

  describe('room operations', () => {
    beforeEach(async () => {
      const connectPromise = socketService.connect()
      // Simulate connection immediately
      mockSocket._simulateConnect()
      await connectPromise
    })

    it('should join room when connected', () => {
      socketService.joinRoom('room-123')
      
      expect(mockSocket.emit).toHaveBeenCalledWith('join-room', {
        roomId: 'room-123',
        userId: mockUser.id,
      })
    })

    it('should leave room when connected', () => {
      socketService.leaveRoom('room-123')
      
      expect(mockSocket.emit).toHaveBeenCalledWith('leave-room', {
        roomId: 'room-123',
        userId: mockUser.id,
      })
    })

    it('should not join room when not connected', () => {
      socketService.disconnect()
      
      socketService.joinRoom('room-123')
      
      expect(mockSocket.emit).not.toHaveBeenCalledWith('join-room', expect.any(Object))
    })

    it('should not leave room when not connected', () => {
      socketService.disconnect()
      
      socketService.leaveRoom('room-123')
      
      expect(mockSocket.emit).not.toHaveBeenCalledWith('leave-room', expect.any(Object))
    })
  })

  describe('message operations', () => {
    beforeEach(async () => {
      const connectPromise = socketService.connect()
      // Simulate connection immediately
      mockSocket._simulateConnect()
      await connectPromise
    })

    it('should send message when connected', () => {
      socketService.sendMessage('room-123', 'Hello world')
      
      expect(mockSocket.emit).toHaveBeenCalledWith('send-message', {
        roomId: 'room-123',
        content: 'Hello world',
      })
    })

    it('should not send message when not connected', () => {
      socketService.disconnect()
      
      socketService.sendMessage('room-123', 'Hello world')
      
      expect(mockSocket.emit).not.toHaveBeenCalledWith('send-message', expect.any(Object))
    })

    it('should send typing indicator when connected', () => {
      socketService.sendTyping('room-123', true)

      expect(mockSocket.emit).toHaveBeenCalledWith('typing', {
        roomId: 'room-123',
        userId: 'user-123',
        username: 'testuser',
        isTyping: true,
      })
    })

    it('should not send typing indicator when not connected', () => {
      socketService.disconnect()
      
      socketService.sendTyping('room-123', true)
      
      expect(mockSocket.emit).not.toHaveBeenCalledWith('typing', expect.any(Object))
    })
  })

  describe('connection state', () => {
    it('should return correct connection state', async () => {
      expect(socketService.isConnected).toBe(false)

      const connectPromise = socketService.connect()
      mockSocket._simulateConnect()
      await connectPromise

      expect(socketService.isConnected).toBe(true)

      socketService.disconnect()

      expect(socketService.isConnected).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle socket errors gracefully', async () => {
      const connectPromise = socketService.connect()
      mockSocket._simulateConnect()
      await connectPromise

      // Socket service handles errors internally via console.error
      // We can test that it doesn't crash when error occurs
      const error = { message: 'Socket error' }

      expect(() => {
        mockSocket._simulateEvent('error', error)
      }).not.toThrow()
    })

    it('should handle disconnect events', async () => {
      const connectPromise = socketService.connect()
      mockSocket._simulateConnect()
      await connectPromise

      const connectionCallback = vi.fn()
      socketService.onConnectionChange(connectionCallback)

      mockSocket._simulateDisconnect()

      expect(connectionCallback).toHaveBeenCalledWith(false)
      expect(socketService.isConnected).toBe(false)
    })
  })

  describe('reconnection', () => {
    it('should handle disconnect events properly', async () => {
      const connectPromise = socketService.connect()
      mockSocket._simulateConnect()
      await connectPromise

      // Simulate unexpected disconnect
      mockSocket._simulateDisconnect()

      // Should update connection state
      expect(socketService.isConnected).toBe(false)
    })
  })
})
