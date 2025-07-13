# Testing Guide

This document provides comprehensive information about the testing setup and practices for the frontend application.

## Overview

Our testing infrastructure is built with:
- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **MSW** - API mocking
- **User Event** - User interaction simulation

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test environment setup
│   └── test-utils.tsx        # Testing utilities and providers
├── services/__tests__/       # Service layer tests
├── hooks/__tests__/          # Custom hooks tests
├── stores/__tests__/         # State management tests
├── lib/__tests__/            # Utility library tests
├── components/__tests__/     # Component tests
└── routes/__tests__/         # Route/page tests
```

## Available Commands

### Basic Commands
```bash
npm test                    # Run tests in watch mode
npm run test:ci            # Run tests once (CI mode)
npm run test:coverage      # Run tests with coverage report
npm run test:ui            # Run tests with UI interface
npm run test:watch         # Run tests in watch mode (explicit)
npm run test:summary       # Show test coverage summary
```

### Advanced Commands
```bash
# Custom test runner with options
node scripts/test.js --help           # Show all options
node scripts/test.js --watch          # Watch mode
node scripts/test.js --coverage       # With coverage
node scripts/test.js --ui             # With UI
node scripts/test.js --verbose        # Verbose output
node scripts/test.js --pattern="**/*.service.test.*"  # Run specific tests
```

## Test Categories

### 1. Service Tests (`services/__tests__/`)
- **auth.service.test.ts** - Authentication service
- **chat.service.test.ts** - Chat functionality
- **socket.service.test.ts** - WebSocket connections
- **todo.service.test.ts** - Todo operations
- **user.service.test.ts** - User management

### 2. Hook Tests (`hooks/__tests__/`)
- **useAuth.test.ts** - Authentication hooks
- **useChat.test.ts** - Chat functionality hooks
- **useTodos.test.ts** - Todo management hooks
- **useUsers.test.ts** - User management hooks
- **useDebounce.test.ts** - Utility hooks

### 3. Store Tests (`stores/__tests__/`)
- **authStore.test.ts** - Authentication state
- **chatStore.test.ts** - Chat state management

### 4. Library Tests (`lib/__tests__/`)
- **http-client.test.ts** - HTTP client utilities
- **error-handler.test.ts** - Error handling
- **config.test.ts** - Configuration management
- **utils.test.ts** - General utilities

### 5. Component Tests (`components/__tests__/`)
- **AuthRequired.test.tsx** - Authentication guard
- **Navigation.test.tsx** - Navigation component
- **ConnectionStatus.test.tsx** - Connection status
- **MessageInput.test.tsx** - Chat message input

### 6. Route Tests (`routes/__tests__/`)
- **profile.test.tsx** - Profile page
- **todo.test.tsx** - Todo page

## Writing Tests

### Test File Naming
- Use `.test.ts` for TypeScript files
- Use `.test.tsx` for React components
- Place tests in `__tests__` directories

### Basic Test Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Testing Components
```typescript
import { renderWithAllProviders } from '@/test/test-utils'

it('should handle user interaction', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  await user.click(screen.getByRole('button'))
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### Mocking Services
```typescript
vi.mock('@/services/api.service', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies
- Use `vi.clearAllMocks()` in `beforeEach`
- Mock at the module level when possible

### 3. Assertions
- Use specific matchers
- Test behavior, not implementation
- Include both positive and negative cases

### 4. Component Testing
- Test user interactions
- Verify accessibility
- Test error states
- Use semantic queries

## Coverage Goals

- **Lines**: > 80%
- **Functions**: > 80%
- **Branches**: > 70%
- **Statements**: > 80%

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Multiple Node.js versions (18.x, 20.x)

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:ci
  
- name: Generate coverage
  run: npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   ```bash
   # Increase timeout in vitest.config.ts
   testTimeout: 10000
   ```

2. **Mock not working**
   ```typescript
   // Ensure mocks are hoisted
   vi.mock('./module', () => ({ ... }))
   ```

3. **DOM not available**
   ```typescript
   // Check test environment in vitest.config.ts
   environment: 'jsdom'
   ```

### Debug Tests
```bash
# Run with verbose output
npm run test:ci -- --reporter=verbose

# Run specific test file
npm test -- MyComponent.test.tsx

# Debug with UI
npm run test:ui
```

## Performance

- Tests run in parallel by default
- Use `--no-coverage` for faster runs during development
- Utilize watch mode for continuous testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
