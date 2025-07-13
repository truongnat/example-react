import { vi } from 'vitest'

// Mock socket instance
const mockSocket = {
  id: 'mock-socket-id',
  connected: false,
  disconnected: true,
  
  // Connection methods
  connect: vi.fn().mockReturnThis(),
  disconnect: vi.fn().mockReturnThis(),
  
  // Event methods
  on: vi.fn().mockReturnThis(),
  off: vi.fn().mockReturnThis(),
  emit: vi.fn().mockReturnThis(),
  once: vi.fn().mockReturnThis(),
  removeAllListeners: vi.fn().mockReturnThis(),
  removeListener: vi.fn().mockReturnThis(),
  addEventListener: vi.fn().mockReturnThis(),
  removeEventListener: vi.fn().mockReturnThis(),
  
  // Auth
  auth: {},
  
  // Simulate connection
  _simulateConnect: () => {
    mockSocket.connected = true
    mockSocket.disconnected = false
    // Trigger connect event
    const connectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect')?.[1]
    if (connectHandler) connectHandler()
  },
  
  // Simulate disconnection
  _simulateDisconnect: () => {
    mockSocket.connected = false
    mockSocket.disconnected = true
    // Trigger disconnect event
    const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')?.[1]
    if (disconnectHandler) disconnectHandler()
  },
  
  // Simulate receiving an event
  _simulateEvent: (event: string, data: any) => {
    const handlers = mockSocket.on.mock.calls.filter(call => call[0] === event)
    handlers.forEach(([, handler]) => {
      if (handler) handler(data)
    })
  },
  
  // Reset mock
  _reset: () => {
    mockSocket.connected = false
    mockSocket.disconnected = true
    vi.clearAllMocks()
  }
}

// Mock io function
const mockIo = vi.fn().mockImplementation((url?: string, options?: any) => {
  // Store connection options
  if (options?.auth) {
    mockSocket.auth = options.auth
  }
  
  return mockSocket
})

// Export mocks
export { mockSocket, mockIo as io }
export default mockIo

// Mock Manager class
export class Manager {
  constructor(public uri: string, public opts: any = {}) {}
  
  socket = vi.fn().mockReturnValue(mockSocket)
  open = vi.fn().mockReturnThis()
  close = vi.fn().mockReturnThis()
  
  // Event methods
  on = vi.fn().mockReturnThis()
  off = vi.fn().mockReturnThis()
  emit = vi.fn().mockReturnThis()
  removeAllListeners = vi.fn().mockReturnThis()
}

// Mock Socket class
export class Socket {
  constructor(public manager: Manager, public nsp: string, public opts: any = {}) {}
  
  id = 'mock-socket-id'
  connected = false
  disconnected = true
  
  // Connection methods
  connect = vi.fn().mockReturnThis()
  disconnect = vi.fn().mockReturnThis()
  
  // Event methods
  on = vi.fn().mockReturnThis()
  off = vi.fn().mockReturnThis()
  emit = vi.fn().mockReturnThis()
  once = vi.fn().mockReturnThis()
  removeAllListeners = vi.fn().mockReturnThis()
  removeListener = vi.fn().mockReturnThis()
}
