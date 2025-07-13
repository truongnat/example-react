import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useChatStore } from '../chatStore'
import { mockRoom, mockMessage } from '@/test/test-utils'
import type { ChatMessage, ChatRoom, TypingUser } from '../chatStore'

// Mock socket service
vi.mock('@/services/socket.service', () => ({
  socketService: {
    sendTyping: vi.fn(),
  },
}))

describe('chatStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useChatStore.setState({
      currentRoomId: null,
      isConnected: false,
      rooms: [],
      messagesByRoom: {},
      typingUsersByRoom: {},
      isTyping: {},
      typingTimeouts: {},
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useChatStore.getState()

      expect(state.currentRoomId).toBeNull()
      expect(state.isConnected).toBe(false)
      expect(state.rooms).toEqual([])
      expect(state.messagesByRoom).toEqual({})
      expect(state.typingUsersByRoom).toEqual({})
      expect(state.isTyping).toEqual({})
      expect(state.typingTimeouts).toEqual({})
    })
  })

  describe('setCurrentRoom', () => {
    it('should set current room correctly', () => {
      const { setCurrentRoom } = useChatStore.getState()

      setCurrentRoom('room-123')

      const state = useChatStore.getState()
      expect(state.currentRoomId).toBe('room-123')
    })

    it('should clear current room when set to null', () => {
      const { setCurrentRoom } = useChatStore.getState()

      setCurrentRoom('room-123')
      setCurrentRoom(null)

      const state = useChatStore.getState()
      expect(state.currentRoomId).toBeNull()
    })
  })

  describe('setConnected', () => {
    it('should set connection status correctly', () => {
      const { setConnected } = useChatStore.getState()

      setConnected(true)

      const state = useChatStore.getState()
      expect(state.isConnected).toBe(true)
    })

    it('should toggle connection status', () => {
      const { setConnected } = useChatStore.getState()

      setConnected(true)
      expect(useChatStore.getState().isConnected).toBe(true)

      setConnected(false)
      expect(useChatStore.getState().isConnected).toBe(false)
    })
  })

  describe('room management', () => {
    const mockChatRoom: ChatRoom = {
      ...mockRoom,
      unreadCount: 0,
      lastActivity: new Date().toISOString(),
    }

    describe('setRooms', () => {
      it('should set rooms correctly', () => {
        const { setRooms } = useChatStore.getState()

        setRooms([mockChatRoom])

        const state = useChatStore.getState()
        expect(state.rooms).toEqual([mockChatRoom])
      })

      it('should replace existing rooms', () => {
        const { setRooms } = useChatStore.getState()

        setRooms([mockChatRoom])
        
        const newRoom = { ...mockChatRoom, id: 'room-456', name: 'New Room' }
        setRooms([newRoom])

        const state = useChatStore.getState()
        expect(state.rooms).toEqual([newRoom])
        expect(state.rooms).toHaveLength(1)
      })
    })

    describe('addRoom', () => {
      it('should add new room to the beginning of the list', () => {
        const { setRooms, addRoom } = useChatStore.getState()

        setRooms([mockChatRoom])

        const newRoom = { ...mockChatRoom, id: 'room-456', name: 'New Room' }
        addRoom(newRoom)

        const state = useChatStore.getState()
        expect(state.rooms).toHaveLength(2)
        expect(state.rooms[0]).toEqual(newRoom)
        expect(state.rooms[1]).toEqual(mockChatRoom)
      })

      it('should replace existing room with same id', () => {
        const { setRooms, addRoom } = useChatStore.getState()

        setRooms([mockChatRoom])

        const updatedRoom = { ...mockChatRoom, name: 'Updated Room' }
        addRoom(updatedRoom)

        const state = useChatStore.getState()
        expect(state.rooms).toHaveLength(1)
        expect(state.rooms[0]).toEqual(updatedRoom)
      })
    })

    describe('updateRoom', () => {
      it('should update existing room', () => {
        const { setRooms, updateRoom } = useChatStore.getState()

        setRooms([mockChatRoom])

        const updates = { name: 'Updated Room Name' }
        updateRoom('room-123', updates)

        const state = useChatStore.getState()
        expect(state.rooms[0].name).toBe('Updated Room Name')
        expect(state.rooms[0].id).toBe('room-123')
      })

      it('should not update non-existent room', () => {
        const { setRooms, updateRoom } = useChatStore.getState()

        setRooms([mockChatRoom])

        updateRoom('non-existent', { name: 'Updated' })

        const state = useChatStore.getState()
        expect(state.rooms).toEqual([mockChatRoom])
      })
    })

    describe('removeRoom', () => {
      it('should remove room by id', () => {
        const { setRooms, removeRoom } = useChatStore.getState()

        const room2 = { ...mockChatRoom, id: 'room-456', name: 'Room 2' }
        setRooms([mockChatRoom, room2])

        removeRoom('room-123')

        const state = useChatStore.getState()
        expect(state.rooms).toHaveLength(1)
        expect(state.rooms[0].id).toBe('room-456')
      })

      it('should not affect rooms when removing non-existent room', () => {
        const { setRooms, removeRoom } = useChatStore.getState()

        setRooms([mockChatRoom])

        removeRoom('non-existent')

        const state = useChatStore.getState()
        expect(state.rooms).toEqual([mockChatRoom])
      })
    })
  })

  describe('message management', () => {
    const mockChatMessage: ChatMessage = {
      ...mockMessage,
    }

    describe('setMessages', () => {
      it('should set messages for a room', () => {
        const { setMessages } = useChatStore.getState()

        setMessages('room-123', [mockChatMessage])

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toEqual([mockChatMessage])
      })

      it('should replace existing messages for a room', () => {
        const { setMessages } = useChatStore.getState()

        setMessages('room-123', [mockChatMessage])

        const newMessage = { ...mockChatMessage, id: 'message-456', content: 'New message' }
        setMessages('room-123', [newMessage])

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toEqual([newMessage])
        expect(state.messagesByRoom['room-123']).toHaveLength(1)
      })
    })

    describe('addMessage', () => {
      it('should add message to room', () => {
        const { addMessage } = useChatStore.getState()

        addMessage(mockChatMessage)

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toEqual([mockChatMessage])
      })

      it('should append to existing messages', () => {
        const { setMessages, addMessage } = useChatStore.getState()

        setMessages('room-123', [mockChatMessage])

        const newMessage = { ...mockChatMessage, id: 'message-456', content: 'New message' }
        addMessage(newMessage)

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toHaveLength(2)
        expect(state.messagesByRoom['room-123'][1]).toEqual(newMessage)
      })

      it('should not add duplicate messages', () => {
        const { addMessage } = useChatStore.getState()

        addMessage(mockChatMessage)
        addMessage(mockChatMessage)

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toHaveLength(1)
      })
    })

    describe('updateMessage', () => {
      it('should update existing message', () => {
        const { setMessages, updateMessage } = useChatStore.getState()

        setMessages('room-123', [mockChatMessage])

        const updates = { content: 'Updated content' }
        updateMessage('message-123', updates)

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123'][0].content).toBe('Updated content')
      })

      it('should not update non-existent message', () => {
        const { setMessages, updateMessage } = useChatStore.getState()

        setMessages('room-123', [mockChatMessage])

        updateMessage('non-existent', { content: 'Updated' })

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toEqual([mockChatMessage])
      })
    })

    describe('removeMessage', () => {
      it('should remove message by id', () => {
        const { setMessages, removeMessage } = useChatStore.getState()

        const message2 = { ...mockChatMessage, id: 'message-456', content: 'Message 2' }
        setMessages('room-123', [mockChatMessage, message2])

        removeMessage('message-123')

        const state = useChatStore.getState()
        expect(state.messagesByRoom['room-123']).toHaveLength(1)
        expect(state.messagesByRoom['room-123'][0].id).toBe('message-456')
      })
    })
  })

  describe('typing indicators', () => {
    const mockTypingUser: TypingUser = {
      userId: 'user-456',
      username: 'otheruser',
      roomId: 'room-123',
    }

    describe('clearTypingUsers', () => {
      it('should clear typing users for a room', () => {
        const { addTypingUser, clearTypingUsers } = useChatStore.getState()

        addTypingUser(mockTypingUser)
        clearTypingUsers('room-123')

        const state = useChatStore.getState()
        expect(state.typingUsersByRoom['room-123']).toEqual([])
      })
    })

    describe('addTypingUser', () => {
      it('should add typing user to room', () => {
        const { addTypingUser } = useChatStore.getState()

        addTypingUser(mockTypingUser)

        const state = useChatStore.getState()
        expect(state.typingUsersByRoom['room-123']).toEqual([mockTypingUser])
      })

      it('should not add duplicate typing users', () => {
        const { addTypingUser } = useChatStore.getState()

        addTypingUser(mockTypingUser)
        addTypingUser(mockTypingUser)

        const state = useChatStore.getState()
        expect(state.typingUsersByRoom['room-123']).toHaveLength(1)
      })
    })

    describe('removeTypingUser', () => {
      it('should remove typing user from room', () => {
        const { addTypingUser, removeTypingUser } = useChatStore.getState()

        const user2 = { ...mockTypingUser, userId: 'user-789', username: 'user2', roomId: 'room-123' }
        addTypingUser(mockTypingUser)
        addTypingUser(user2)

        removeTypingUser('user-456', 'room-123')

        const state = useChatStore.getState()
        expect(state.typingUsersByRoom['room-123']).toHaveLength(1)
        expect(state.typingUsersByRoom['room-123'][0].userId).toBe('user-789')
      })
    })
  })

  describe('unread count management', () => {
    it('should increment unread count for room', () => {
      const { setRooms, incrementUnreadCount } = useChatStore.getState()

      const roomWithUnread = { ...mockRoom, unreadCount: 0 }
      setRooms([roomWithUnread])

      incrementUnreadCount('room-123')

      const state = useChatStore.getState()
      expect(state.rooms[0].unreadCount).toBe(1)
    })

    it('should clear unread count for room', () => {
      const { setRooms, clearUnreadCount } = useChatStore.getState()

      const roomWithUnread = { ...mockRoom, unreadCount: 5 }
      setRooms([roomWithUnread])

      clearUnreadCount('room-123')

      const state = useChatStore.getState()
      expect(state.rooms[0].unreadCount).toBe(0)
    })
  })
})
