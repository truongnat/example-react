import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionStatus, InlineConnectionStatus } from '../ConnectionStatus'
import { useSocket } from '@/providers/SocketProvider'

// Mock the socket provider
vi.mock('@/providers/SocketProvider', () => ({
  useSocket: vi.fn(),
}))

describe('ConnectionStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when connected and no error', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: true,
      connectionError: null,
      socketId: 'test-socket-id',
    })

    const { container } = render(<ConnectionStatus />)
    expect(container.firstChild).toBeNull()
  })

  it('should show connecting status when disconnected', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: false,
      connectionError: null,
      socketId: null,
    })

    render(<ConnectionStatus />)

    expect(screen.getByText(/connecting to chat server/i)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should show error message when connection error exists', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: false,
      connectionError: 'Failed to connect to server',
      socketId: null,
    })

    render(<ConnectionStatus />)

    expect(screen.getByText(/connection error: failed to connect to server/i)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should show error even when connected if error exists', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: true,
      connectionError: 'Connection unstable',
      socketId: 'test-socket-id',
    })

    render(<ConnectionStatus />)

    expect(screen.getByText(/connection error: connection unstable/i)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

})

describe('InlineConnectionStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show connected status when connected', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: true,
      connectionError: null,
      socketId: 'test-socket-id',
    })

    render(<InlineConnectionStatus />)

    expect(screen.getByText(/connected/i)).toBeInTheDocument()
  })

  it('should show connecting status when disconnected', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: false,
      connectionError: null,
      socketId: null,
    })

    render(<InlineConnectionStatus />)

    expect(screen.getByText(/connecting/i)).toBeInTheDocument()
  })

  it('should show connection error when error exists', () => {
    vi.mocked(useSocket).mockReturnValue({
      connected: false,
      connectionError: 'Connection failed',
      socketId: null,
    })

    render(<InlineConnectionStatus />)

    expect(screen.getByText(/connection error/i)).toBeInTheDocument()
  })
})
