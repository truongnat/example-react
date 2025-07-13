import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthRequired } from '../AuthRequired'

// Mock the router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    Link: ({ to, search, children, ...props }: any) => {
      let href = to
      if (search) {
        const searchParams = new URLSearchParams(search)
        href = `${to}?${searchParams.toString()}`
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      )
    },
  }
})

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, ...props }: any) => (
    <button className={`${className} ${variant}`} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className, ...props }: any) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h2 className={className} {...props}>
      {children}
    </h2>
  ),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Lock: (props: any) => <div data-testid="lock-icon" {...props} />,
  LogIn: (props: any) => <div data-testid="login-icon" {...props} />,
  UserPlus: (props: any) => <div data-testid="userplus-icon" {...props} />,
}))

describe('AuthRequired', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/protected-page' },
      writable: true,
    })
  })

  it('should render authentication required message', () => {
    render(<AuthRequired />)

    expect(screen.getByText('Authentication Required')).toBeInTheDocument()
    expect(screen.getByText('You need to sign in to access this page')).toBeInTheDocument()
  })

  it('should render lock icon', () => {
    render(<AuthRequired />)

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
  })

  it('should render sign in button with link to login', () => {
    render(<AuthRequired />)

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    expect(signInButton).toBeInTheDocument()
    expect(signInButton.closest('a')).toHaveAttribute('href', '/login?redirect=%2Fprotected-page')
  })

  it('should render create account button with link to register', () => {
    render(<AuthRequired />)

    const createAccountButton = screen.getByRole('button', { name: /create account/i })
    expect(createAccountButton).toBeInTheDocument()
    expect(createAccountButton.closest('a')).toHaveAttribute('href', '/register')
  })

  it('should render back to home link', () => {
    render(<AuthRequired />)

    const backToHomeLink = screen.getByRole('link', { name: /back to home/i })
    expect(backToHomeLink).toBeInTheDocument()
    expect(backToHomeLink).toHaveAttribute('href', '/')
  })

  it('should include current pathname in login redirect', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard' },
      writable: true,
    })

    render(<AuthRequired />)

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    expect(signInButton.closest('a')).toHaveAttribute('href', '/login?redirect=%2Fdashboard')
  })

  it('should render with proper styling classes', () => {
    render(<AuthRequired />)

    // Find the outermost container div
    const container = screen.getByText('Authentication Required').closest('div').parentElement?.parentElement
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')
  })

  it('should have proper accessibility attributes', () => {
    render(<AuthRequired />)

    const title = screen.getByText('Authentication Required')
    expect(title).toBeInTheDocument()

    const description = screen.getByText('You need to sign in to access this page')
    expect(description).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })

    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('should render icons in buttons', () => {
    render(<AuthRequired />)

    expect(screen.getByTestId('login-icon')).toBeInTheDocument()
    expect(screen.getByTestId('userplus-icon')).toBeInTheDocument()
  })

  it('should handle button interactions', async () => {
    const user = userEvent.setup()
    render(<AuthRequired />)

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    const createAccountButton = screen.getByRole('button', { name: /create account/i })

    // Should be able to interact with buttons
    await user.hover(signInButton)
    await user.hover(createAccountButton)

    expect(signInButton).toBeInTheDocument()
    expect(createAccountButton).toBeInTheDocument()
  })
})
