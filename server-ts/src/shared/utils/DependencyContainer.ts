import { DatabaseConnectionFactory, DatabaseConnection } from '@infrastructure/database/DatabaseConnection';
import { SQLiteConnection } from '@infrastructure/database/SQLiteConnection';
import { SQLiteUserRepository } from '@infrastructure/repositories/SQLiteUserRepository';
import { SQLiteTodoRepository } from '@infrastructure/repositories/SQLiteTodoRepository';
import { PasswordService } from '@infrastructure/external-services/PasswordService';
import { TokenService } from '@infrastructure/external-services/TokenService';
import { EmailService } from '@infrastructure/external-services/EmailService';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';

// Domain
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';

// Application
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { IEmailService } from '@application/interfaces/IEmailService';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { GetUserUseCase } from '@application/use-cases/auth/GetUserUseCase';
import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';

// Presentation
import { AuthController } from '@presentation/controllers/AuthController';
import { TodoController } from '@presentation/controllers/TodoController';
import { AuthRoutes } from '@presentation/routes/AuthRoutes';
import { TodoRoutes } from '@presentation/routes/TodoRoutes';

export class DependencyContainer {
  private static instance: DependencyContainer;
  
  // Infrastructure
  private _databaseConnection!: DatabaseConnection;
  private _userRepository!: IUserRepository;
  private _todoRepository!: ITodoRepository;
  private _passwordService!: IPasswordService;
  private _tokenService!: ITokenService;
  private _emailService!: IEmailService;
  private _authMiddleware!: AuthMiddleware;

  // Application
  private _registerUseCase!: RegisterUseCase;
  private _loginUseCase!: LoginUseCase;
  private _getUserUseCase!: GetUserUseCase;
  private _createTodoUseCase!: CreateTodoUseCase;
  private _getTodosUseCase!: GetTodosUseCase;

  // Presentation
  private _authController!: AuthController;
  private _todoController!: TodoController;
  private _authRoutes!: AuthRoutes;
  private _todoRoutes!: TodoRoutes;

  private constructor() {}

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  public async initialize(): Promise<void> {
    // Initialize database connection
    this._databaseConnection = await DatabaseConnectionFactory.create();
    await this._databaseConnection.connect();

    // Initialize repositories
    if (this._databaseConnection instanceof SQLiteConnection) {
      this._userRepository = new SQLiteUserRepository(this._databaseConnection);
      this._todoRepository = new SQLiteTodoRepository(this._databaseConnection);
    }

    // Initialize services
    this._passwordService = new PasswordService();
    this._tokenService = new TokenService();
    this._emailService = new EmailService();
    this._authMiddleware = new AuthMiddleware(this._tokenService, this._userRepository);

    // Initialize use cases
    this._registerUseCase = new RegisterUseCase(
      this._userRepository,
      this._passwordService,
      this._tokenService
    );
    this._loginUseCase = new LoginUseCase(
      this._userRepository,
      this._passwordService,
      this._tokenService
    );
    this._createTodoUseCase = new CreateTodoUseCase(this._todoRepository);
    this._getTodosUseCase = new GetTodosUseCase(this._todoRepository);

    // Initialize controllers
    this._authController = new AuthController(
      this._registerUseCase,
      this._loginUseCase
    );
    this._todoController = new TodoController(
      this._createTodoUseCase,
      this._getTodosUseCase
    );

    // Initialize routes
    this._authRoutes = new AuthRoutes(this._authController, this._authMiddleware);
    this._todoRoutes = new TodoRoutes(this._todoController, this._authMiddleware);
  }

  public async cleanup(): Promise<void> {
    if (this._databaseConnection) {
      await this._databaseConnection.disconnect();
    }
  }

  // Getters
  public get databaseConnection(): DatabaseConnection {
    return this._databaseConnection;
  }

  public get userRepository(): IUserRepository {
    return this._userRepository;
  }

  public get authRoutes(): AuthRoutes {
    return this._authRoutes;
  }

  public get todoRoutes(): TodoRoutes {
    return this._todoRoutes;
  }

  public get authMiddleware(): AuthMiddleware {
    return this._authMiddleware;
  }
}
