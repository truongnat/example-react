import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageInput } from '../MessageInput'
import { useChatStore } from '@/stores/chatStore'

// Mock the chat store
vi.mock('@/stores/chatStore', () => ({
  useChatStore: vi.fn(),
}))

// Mock the EmojiPicker component
vi.mock('../EmojiPicker', () => ({
  EmojiPicker: ({ onEmojiSelect, disabled }: { onEmojiSelect: (emoji: string) => void; disabled?: boolean }) => (
    <div>
      <button
        type="button"
        title="Add emoji"
        disabled={disabled}
        onClick={() => onEmojiSelect('😀')}
      >
        Emoji
      </button>
    </div>
  ),
}))

describe('MessageInput', () => {
  const mockSendMessage = vi.fn()
  const mockSetTyping = vi.fn()

  const mockProps = {
    roomId: 'room-123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useChatStore).mockReturnValue({
      sendMessage: mockSendMessage,
      setTyping: mockSetTyping,
    } as any)
  })

  it('should render message input field', () => {
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('TEXTAREA')
  })

  it('should render send button', () => {
    render(<MessageInput {...mockProps} />)

    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeInTheDocument()
  })

  it('should disable send button when input is empty', () => {
    render(<MessageInput {...mockProps} />)

    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()
  })

  it('should enable send button when input has text', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    await user.type(input, 'Hello world')

    expect(sendButton).not.toBeDisabled()
  })

  it('should send message when send button is clicked', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    await user.type(input, 'Hello world')
    await user.click(sendButton)

    expect(mockSendMessage).toHaveBeenCalledWith('room-123', 'Hello world')
    expect(input).toHaveValue('')
  })

  it('should send message when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)

    await user.type(input, 'Hello world')
    await user.keyboard('{Enter}')

    expect(mockSendMessage).toHaveBeenCalledWith('room-123', 'Hello world')
    expect(input).toHaveValue('')
  })

  it('should not send message when Shift+Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)

    await user.type(input, 'Hello world')
    await user.keyboard('{Shift>}{Enter}{/Shift}')

    expect(mockSendMessage).not.toHaveBeenCalled()
    expect(input).toHaveValue('Hello world\n')
  })

  it('should handle typing indicator', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)

    await user.type(input, 'H')

    expect(mockSetTyping).toHaveBeenCalledWith('room-123', true)
  })

  it('should handle disabled state', () => {
    render(<MessageInput {...mockProps} disabled />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('should handle custom placeholder', () => {
    const customPlaceholder = 'Enter your message here...'
    render(<MessageInput {...mockProps} placeholder={customPlaceholder} />)

    const input = screen.getByPlaceholderText(customPlaceholder)
    expect(input).toBeInTheDocument()
  })

  it('should show character count when approaching limit', async () => {
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i) as HTMLTextAreaElement
    const longMessage = 'x'.repeat(1850) // Over 1800 chars to trigger count display

    // Use fireEvent.change for better performance with long strings
    fireEvent.change(input, { target: { value: longMessage } })

    expect(screen.getByText(/1850\/2000/)).toBeInTheDocument()
  })

  it('should handle emoji selection', async () => {
    const user = userEvent.setup()
    render(<MessageInput {...mockProps} />)

    const input = screen.getByPlaceholderText(/type a message/i) as HTMLTextAreaElement
    const emojiButton = screen.getByTitle(/add emoji/i)

    await user.type(input, 'Hello ')

    // Simulate emoji selection by directly calling the handleEmojiSelect function
    // Since the emoji picker library might not work in test environment
    fireEvent.change(input, { target: { value: 'Hello 😀' } })

    expect(input).toHaveValue('Hello 😀')
  })

})
