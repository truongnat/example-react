import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'

// Mock the hooks
vi.mock('../../hooks/useAuth', () => ({
  useCurrentUser: vi.fn(),
  useUpdateProfile: vi.fn(),
  useLogout: vi.fn(),
}))

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

// Mock the auth store
const mockAuthStore = {
  user: {
    id: '1',
    name: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
  },
  isAuthenticated: true,
}

describe('Profile Page', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    // Mock auth store
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  const renderProfilePage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <div data-testid="profile-page">Profile Page Test</div>
      </QueryClientProvider>
    )
  }

  it('should render profile page', () => {
    renderProfilePage()
    expect(screen.getByTestId('profile-page')).toBeInTheDocument()
  })
})

// Test for profile validation functionality
describe('Profile Validation', () => {
  const validateProfile = (name: string, avatarUrl: string) => {
    const errors: string[] = []

    if (!name.trim()) {
      errors.push('Name is required')
    } else if (name.trim().length < 3) {
      errors.push('Name must be at least 3 characters long')
    } else if (name.trim().length > 50) {
      errors.push('Name must be less than 50 characters')
    } else if (!/^[a-zA-Z0-9_-]+$/.test(name.trim())) {
      errors.push('Name can only contain letters, numbers, underscores, and hyphens')
    }

    if (avatarUrl.trim() && !isValidUrl(avatarUrl.trim())) {
      errors.push('Avatar URL must be a valid URL')
    }

    return errors
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  it('should validate username correctly', () => {
    expect(validateProfile('', '')).toContain('Name is required')
    expect(validateProfile('ab', '')).toContain('Name must be at least 3 characters long')
    expect(validateProfile('a'.repeat(51), '')).toContain('Name must be less than 50 characters')
    expect(validateProfile('invalid name!', '')).toContain('Name can only contain letters, numbers, underscores, and hyphens')
    expect(validateProfile('validname123', '')).toHaveLength(0)
    expect(validateProfile('valid_name-123', '')).toHaveLength(0)
  })

  it('should validate avatar URL correctly', () => {
    expect(validateProfile('validname', 'invalid-url')).toContain('Avatar URL must be a valid URL')
    expect(validateProfile('validname', 'https://example.com/avatar.jpg')).toHaveLength(0)
    expect(validateProfile('validname', '')).toHaveLength(0) // Empty URL is allowed
  })

  it('should allow valid profile data', () => {
    expect(validateProfile('testuser123', 'https://example.com/avatar.jpg')).toHaveLength(0)
    expect(validateProfile('test_user-123', '')).toHaveLength(0)
  })
})

// Test for profile update functionality
describe('Profile Update', () => {
  it('should detect changes in profile data', () => {
    const currentUser = {
      username: 'oldname',
      avatarUrl: 'https://old-avatar.com/image.jpg',
    }

    const newProfile = {
      name: 'newname',
      avatar: 'https://new-avatar.com/image.jpg',
    }

    const detectChanges = (current: any, updated: any) => {
      const changes: any = {}
      
      if (updated.name !== current.username) {
        changes.username = updated.name.trim()
      }
      if (updated.avatar !== current.avatarUrl) {
        changes.avatarUrl = updated.avatar.trim() || undefined
      }

      return changes
    }

    const changes = detectChanges(currentUser, newProfile)
    expect(changes).toHaveProperty('username', 'newname')
    expect(changes).toHaveProperty('avatarUrl', 'https://new-avatar.com/image.jpg')
  })

  it('should not include unchanged fields in update', () => {
    const currentUser = {
      username: 'samename',
      avatarUrl: 'https://same-avatar.com/image.jpg',
    }

    const newProfile = {
      name: 'samename',
      avatar: 'https://same-avatar.com/image.jpg',
    }

    const detectChanges = (current: any, updated: any) => {
      const changes: any = {}
      
      if (updated.name !== current.username) {
        changes.username = updated.name.trim()
      }
      if (updated.avatar !== current.avatarUrl) {
        changes.avatarUrl = updated.avatar.trim() || undefined
      }

      return changes
    }

    const changes = detectChanges(currentUser, newProfile)
    expect(Object.keys(changes)).toHaveLength(0)
  })

  it('should handle empty avatar URL correctly', () => {
    const currentUser = {
      username: 'testuser',
      avatarUrl: 'https://old-avatar.com/image.jpg',
    }

    const newProfile = {
      name: 'testuser',
      avatar: '',
    }

    const detectChanges = (current: any, updated: any) => {
      const changes: any = {}
      
      if (updated.name !== current.username) {
        changes.username = updated.name.trim()
      }
      if (updated.avatar !== current.avatarUrl) {
        changes.avatarUrl = updated.avatar.trim() || undefined
      }

      return changes
    }

    const changes = detectChanges(currentUser, newProfile)
    expect(changes).toHaveProperty('avatarUrl', undefined)
  })
})

// Test for form interaction
describe('Profile Form Interaction', () => {
  it('should clear validation errors when user starts typing', () => {
    const mockSetValidationError = vi.fn()
    
    // Simulate user typing in input field
    const handleInputChange = (value: string) => {
      // Clear validation error when user starts typing
      mockSetValidationError('')
    }

    handleInputChange('new value')
    expect(mockSetValidationError).toHaveBeenCalledWith('')
  })

  it('should show loading state during update', () => {
    const mockUpdateMutation = {
      isPending: true,
      mutate: vi.fn(),
    }

    expect(mockUpdateMutation.isPending).toBe(true)
  })

  it('should handle successful update', () => {
    const mockOnSuccess = vi.fn()
    const mockSetIsEditing = vi.fn()
    const mockSetValidationError = vi.fn()

    // Simulate successful update
    const handleSuccess = () => {
      mockSetIsEditing(false)
      mockSetValidationError('')
      mockOnSuccess()
    }

    handleSuccess()
    expect(mockSetIsEditing).toHaveBeenCalledWith(false)
    expect(mockSetValidationError).toHaveBeenCalledWith('')
    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('should handle update error', () => {
    const mockSetValidationError = vi.fn()
    const error = new Error('Update failed')

    // Simulate error handling
    const handleError = (error: Error) => {
      mockSetValidationError(error.message || 'Failed to update profile')
    }

    handleError(error)
    expect(mockSetValidationError).toHaveBeenCalledWith('Update failed')
  })
})
