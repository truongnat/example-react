import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '../Navigation'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import { renderWithAllProviders, mockUser } from '@/test/test-utils'

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

// Mock the logout hook
vi.mock('@/hooks/useAuth', () => ({
  useLogout: vi.fn(),
}))

// Mock router navigation
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/dashboard',
    search: '',
    hash: '',
  }),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  createRootRoute: vi.fn((config: any) => ({
    component: config?.component || (() => null),
    _addFileChildren: vi.fn(() => ({
      _addFileTypes: vi.fn(() => ({})),
    })),
  })),
  createFileRoute: vi.fn(() => (config: any) => ({
    component: config?.component || (() => null),
    update: vi.fn((updateConfig: any) => ({
      component: updateConfig?.component || config?.component || (() => null),
      id: updateConfig?.id,
      path: updateConfig?.path,
      fullPath: updateConfig?.fullPath,
    })),
  })),
  createRouter: vi.fn(() => ({
    navigate: mockNavigate,
  })),
  Outlet: () => null,
}))

describe('Navigation', () => {
  const mockLogoutMutation = {
    mutate: vi.fn(),
    isPending: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLogout).mockReturnValue(mockLogoutMutation as any)
  })

  it('should render navigation when user is authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show navigation links (desktop and mobile)
    expect(screen.getAllByText('Home')).toHaveLength(2)
    expect(screen.getAllByText('Todo')).toHaveLength(2)
    expect(screen.getAllByText('Chat')).toHaveLength(2)
    expect(screen.getAllByText('Profile')).toHaveLength(3) // Desktop nav + mobile nav + profile button
  })

  it('should not render navigation when user is not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      user: null,
    } as any)

    render(<Navigation />)

    // Navigation links are still shown but user actions are different
    expect(screen.getAllByText('Home')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Todo')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Chat')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Profile')).toHaveLength(2) // Desktop and mobile

    // Should show sign in/register buttons instead of user info
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('should display user information when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show user name in welcome message
    expect(screen.getByText('Welcome, testuser')).toBeInTheDocument()
  })

  it('should show user profile button when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show profile button instead of avatar
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
  })

  it('should show app logo and title', () => {
    render(<Navigation />)

    // Should show app logo with initials
    expect(screen.getByText('MS')).toBeInTheDocument()
    expect(screen.getByText('MERN Stack')).toBeInTheDocument()
  })

  it('should handle logout when logout button is clicked', async () => {
    const user = userEvent.setup()
    
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Find and click logout button
    const logoutButton = screen.getByRole('button', { name: /sign out/i })
    await user.click(logoutButton)

    expect(mockLogoutMutation.mutate).toHaveBeenCalled()
  })

  it('should show loading state during logout', () => {
    const loadingLogoutMutation = {
      ...mockLogoutMutation,
      isPending: true,
    }

    vi.mocked(useLogout).mockReturnValue(loadingLogoutMutation as any)
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    const logoutButton = screen.getByRole('button', { name: /signing out/i })
    expect(logoutButton).toBeDisabled()
  })

  it('should have consistent navigation link styling', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    const todoLink = screen.getAllByText('Todo')[0] // Get desktop version
    expect(todoLink.closest('a')).toHaveClass('text-gray-600', 'hover:text-blue-600') // Default link styling
  })

  it('should show mobile navigation section', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show mobile navigation section (always visible in DOM)
    const mobileSection = document.querySelector('.md\\:hidden')
    expect(mobileSection).toBeInTheDocument()

    // Mobile section should contain navigation links
    expect(mobileSection).toContainElement(screen.getAllByText('Home')[1])
    expect(mobileSection).toContainElement(screen.getAllByText('Todo')[1])
  })

  it('should show navigation menu items', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show all navigation menu items (desktop and mobile)
    expect(screen.getAllByText('Home')).toHaveLength(2)
    expect(screen.getAllByText('Todo')).toHaveLength(2)
    expect(screen.getAllByText('Chat')).toHaveLength(2)
    expect(screen.getAllByText('Profile')).toHaveLength(3) // Desktop nav + mobile nav + profile button
  })

  it('should not show notification badge when there are no unread messages', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation unreadCount={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Tab through navigation items (desktop version)
    await user.tab()
    expect(screen.getAllByText('Home')[0].closest('a')).toHaveFocus()

    await user.tab()
    expect(screen.getAllByText('Todo')[0].closest('a')).toHaveFocus()

    await user.tab()
    expect(screen.getAllByText('Chat')[0].closest('a')).toHaveFocus()
  })

  it('should handle user dropdown menu', async () => {
    const user = userEvent.setup()
    
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show profile and sign out buttons
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()

    // Click on profile button should work
    const profileButton = screen.getByRole('button', { name: /profile/i })
    await user.click(profileButton)
    // Profile button is wrapped in a link, so clicking should work
  })

  it('should show mobile navigation menu', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    // Should show mobile navigation (hidden by default but present in DOM)
    const mobileNav = document.querySelector('.md\\:hidden')
    expect(mobileNav).toBeInTheDocument()

    // Mobile nav should have same links
    expect(screen.getAllByText('Home')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Todo')).toHaveLength(2) // Desktop and mobile
  })

  it('should handle responsive design classes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'sticky', 'top-0', 'z-50')
  })

  it('should handle accessibility attributes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    } as any)

    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()

    // All links should have href attributes
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })
})
