# Test Documentation

This directory contains comprehensive test suites for the Clean Architecture TypeScript backend application.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── domain/             # Domain layer tests
│   │   ├── entities/       # Entity business logic tests
│   │   ├── repositories/   # Repository interface tests
│   │   └── services/       # Domain service tests
│   ├── application/        # Application layer tests
│   │   ├── use-cases/      # Use case tests
│   │   │   ├── auth/       # Authentication use cases
│   │   │   ├── todo/       # Todo management use cases
│   │   │   ├── chat/       # Chat functionality use cases
│   │   │   └── user/       # User management use cases
│   │   ├── dtos/           # Data Transfer Object tests
│   │   └── interfaces/     # Interface tests
│   ├── infrastructure/     # Infrastructure layer tests
│   │   ├── repositories/   # Repository implementation tests
│   │   ├── external-services/ # External service tests
│   │   ├── middleware/     # Middleware tests
│   │   └── config/         # Configuration tests
│   └── presentation/       # Presentation layer tests
│       ├── controllers/    # Controller tests
│       ├── validators/     # Validator tests
│       └── middleware/     # Presentation middleware tests
├── integration/            # Integration tests
│   ├── api/               # API endpoint integration tests
│   ├── database/          # Database integration tests
│   └── external-services/ # External service integration tests
├── e2e/                   # End-to-end tests
│   ├── auth/              # Authentication flow tests
│   ├── todo/              # Todo management flow tests
│   └── chat/              # Chat functionality flow tests
└── utils/                 # Test utilities and helpers
    ├── factories/         # Test data factories
    ├── mocks/             # Mock implementations
    └── helpers/           # Test helper functions
```

## Test Types

### Unit Tests
- Test individual components in isolation
- Mock all dependencies
- Fast execution
- High code coverage
- Located in `tests/unit/`

### Integration Tests
- Test component interactions
- Use real implementations where possible
- Test database operations
- Test external service integrations
- Located in `tests/integration/`

### End-to-End Tests
- Test complete user workflows
- Test API endpoints with real HTTP requests
- Test business scenarios from start to finish
- Located in `tests/e2e/`

## Running Tests

### All Tests
```bash
npm test                    # Run all tests
npm run test:coverage      # Run all tests with coverage report
npm run test:watch         # Run tests in watch mode
```

### Specific Test Types
```bash
npm run test:unit          # Run only unit tests
npm run test:integration   # Run only integration tests
npm run test:e2e           # Run only end-to-end tests
npm run test:all           # Run all test types explicitly
```

### Watch Mode
```bash
npm run test:unit:watch         # Watch unit tests
npm run test:integration:watch  # Watch integration tests
npm run test:e2e:watch          # Watch e2e tests
```

### Specific Test Files
```bash
npm test -- auth                    # Run tests matching "auth"
npm test -- CreateTodoUseCase      # Run specific test file
npm test -- --testPathPattern=unit # Run tests in unit directory
```

## Test Utilities

### Factories
Test data factories for creating consistent test data:
- `UserFactory` - Create user entities with various configurations
- `TodoFactory` - Create todo entities with different statuses
- `RoomFactory` - Create chat room entities
- `MessageFactory` - Create message entities

Example usage:
```typescript
import { UserFactory, TodoFactory } from '../utils/factories';

const user = UserFactory.create({ email: 'test@example.com' });
const todos = TodoFactory.createMany(5, { userId: user.id });
const completedTodo = TodoFactory.createCompleted({ userId: user.id });
```

### Mocks
Pre-configured mock implementations:
- `createMockUserRepository()` - Mock user repository
- `createMockTodoRepository()` - Mock todo repository
- `createMockPasswordService()` - Mock password service
- `createMockTokenService()` - Mock token service

Example usage:
```typescript
import { createMockUserRepository } from '../utils/mocks';

const mockUserRepository = createMockUserRepository();
mockUserRepository.findById.mockResolvedValue(user);
```

### Helpers
Test helper functions:
- `createMockRequest()` - Create Express request mock
- `createMockResponse()` - Create Express response mock
- `generateTestUUID()` - Generate test UUIDs
- `createPaginatedResult()` - Create paginated test results

## Test Patterns

### Unit Test Pattern
```typescript
describe('UseCase', () => {
  let useCase: UseCase;
  let mockRepository: jest.Mocked<Repository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    useCase = new UseCase(mockRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { /* test data */ };
      mockRepository.method.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(mockRepository.method).toHaveBeenCalledWith(expectedArgs);
      expect(result).toEqual(expectedResult);
    });

    it('should handle error case', async () => {
      // Arrange
      mockRepository.method.mockRejectedValue(new Error('Test error'));

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow('Test error');
    });
  });
});
```

### Integration Test Pattern
```typescript
describe('API Integration', () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('should handle API request', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(testData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### E2E Test Pattern
```typescript
describe('User Flow E2E', () => {
  let app: Express;
  let userTokens: any;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    // Setup user session
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials);
    userTokens = registerResponse.body.data.tokens;
  });

  it('should complete full workflow', async () => {
    // Step 1: Create resource
    const createResponse = await request(app)
      .post('/api/resource')
      .set('Authorization', `Bearer ${userTokens.accessToken}`)
      .send(resourceData)
      .expect(201);

    // Step 2: Verify resource
    const getResponse = await request(app)
      .get(`/api/resource/${createResponse.body.data.id}`)
      .set('Authorization', `Bearer ${userTokens.accessToken}`)
      .expect(200);

    // Continue workflow...
  });
});
```

## Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Cover all API endpoints
- **E2E Tests**: Cover all major user workflows

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the scenario
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Test Independence**: Each test should be independent
4. **Mock External Dependencies**: Mock databases, APIs, etc. in unit tests
5. **Use Factories**: Use test data factories for consistent test data
6. **Clean Up**: Clean up test data after each test
7. **Test Edge Cases**: Test both success and failure scenarios
8. **Performance**: Keep tests fast and reliable

## Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Debug Mode
```bash
npm test -- --detectOpenHandles --forceExit
```

### Verbose Output
```bash
npm test -- --verbose
```

### Coverage Report
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```
