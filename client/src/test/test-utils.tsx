import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { SocketProvider } from '../providers/SocketProvider'

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
  withSocket?: boolean
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    queryClient,
    withSocket = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Create a new query client for each test if not provided
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  // Create router with memory history
  const history = createMemoryHistory({
    initialEntries,
  })

  const router = createRouter({
    routeTree,
    history,
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    )

    if (withSocket) {
      return (
        <SocketProvider>
          {content}
        </SocketProvider>
      )
    }

    return content
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: testQueryClient,
    router,
    history,
  }
}

// Helper to render with router
export function renderWithRouter(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  return renderWithProviders(ui, { ...options })
}

// Helper to render with query client only
export function renderWithQueryClient(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  return renderWithProviders(ui, { ...options })
}

// Helper to render with all providers
export function renderWithAllProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  return renderWithProviders(ui, { ...options, withSocket: true })
}

// Mock data factories
export const mockUser = {
  id: 'user-123',
  name: 'testuser',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
}

export const mockAuthTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

export const mockTodo = {
  id: 'todo-123',
  title: 'Test Todo',
  content: 'Test content',
  status: 'INITIAL' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user-123',
}

export const mockRoom = {
  id: 'room-123',
  name: 'Test Room',
  avatarUrl: 'https://example.com/room.jpg',
  authorId: 'user-123',
  participants: ['user-123', 'user-456'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockMessage = {
  id: 'message-123',
  content: 'Test message',
  authorId: 'user-123',
  roomId: 'room-123',
  author: {
    id: 'user-123',
    username: 'testuser',
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock API responses
export const mockApiResponse = <T>(data: T, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
  errors: success ? undefined : ['Test error'],
})

export const mockApiError = (status: number, message: string) => ({
  success: false,
  data: null,
  message,
  errors: [message],
  status,
})

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper to create mock fetch response
export const mockFetchResponse = <T>(data: T, status = 200, ok = true) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  headers: new Headers(),
  redirected: false,
  statusText: ok ? 'OK' : 'Error',
  type: 'basic' as ResponseType,
  url: 'http://localhost:8080/api/test',
  clone: () => mockFetchResponse(data, status, ok),
  body: null,
  bodyUsed: false,
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob(),
  formData: async () => new FormData(),
})

// Helper to mock localStorage with data
export const mockLocalStorageWithAuth = (user = mockUser, tokens = mockAuthTokens) => {
  const authData = {
    state: {
      user,
      tokens,
      isAuthenticated: true,
    },
    version: 0,
  }
  
  localStorage.setItem('auth-storage', JSON.stringify(authData))
}

// Helper to clear all mocks
export const clearAllMocks = () => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
