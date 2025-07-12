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
import { LogoutUseCase } from '@application/use-cases/auth/LogoutUseCase';
import { GetUserUseCase } from '@application/use-cases/auth/GetUserUseCase';
import { UpdateUserUseCase } from '@application/use-cases/auth/UpdateUserUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/auth/RefreshTokenUseCase';
import { SearchUsersUseCase } from '@application/use-cases/user/SearchUsersUseCase';
import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';
import { UpdateTodoUseCase } from '@application/use-cases/todo/UpdateTodoUseCase';
import { UpdateTodoStatusUseCase } from '@application/use-cases/todo/UpdateTodoStatusUseCase';
import { DeleteTodoUseCase } from '@application/use-cases/todo/DeleteTodoUseCase';

// Presentation
import { AuthController } from '@presentation/controllers/AuthController';
import { TodoController } from '@presentation/controllers/TodoController';
import { ChatController } from '@presentation/controllers/ChatController';
import { UserController } from '@presentation/controllers/UserController';
import { AuthRoutes } from '@presentation/routes/AuthRoutes';
import { TodoRoutes } from '@presentation/routes/TodoRoutes';
import { ChatRoutes } from '@presentation/routes/ChatRoutes';
import { UserRoutes } from '@presentation/routes/UserRoutes';

// Chat imports
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { SQLiteRoomRepository } from '@infrastructure/repositories/SQLiteRoomRepository';
import { SQLiteMessageRepository } from '@infrastructure/repositories/SQLiteMessageRepository';
import { SocketService } from '@infrastructure/external-services/SocketService';

// Chat use cases
import {
  CreateRoomUseCase,
  UpdateRoomUseCase,
  GetRoomsUseCase,
  GetRoomUseCase,
  DeleteRoomUseCase,
  JoinRoomUseCase,
  LeaveRoomUseCase,
  InviteUsersUseCase,
  GetRoomMembersUseCase,
  RemoveMemberUseCase,
  CreateMessageUseCase,
  UpdateMessageUseCase,
  GetMessagesUseCase,
  DeleteMessageUseCase
} from '@application/use-cases/chat';

export class DependencyContainer {
  private static instance: DependencyContainer;
  
  // Infrastructure
  private _databaseConnection!: DatabaseConnection;
  private _userRepository!: IUserRepository;
  private _todoRepository!: ITodoRepository;
  private _roomRepository!: IRoomRepository;
  private _messageRepository!: IMessageRepository;
  private _passwordService!: IPasswordService;
  private _tokenService!: ITokenService;
  private _emailService!: IEmailService;
  private _authMiddleware!: AuthMiddleware;
  private _socketService!: SocketService;

  // Application
  private _registerUseCase!: RegisterUseCase;
  private _loginUseCase!: LoginUseCase;
  private _logoutUseCase!: LogoutUseCase;
  private _getUserUseCase!: GetUserUseCase;
  private _updateUserUseCase!: UpdateUserUseCase;
  private _refreshTokenUseCase!: RefreshTokenUseCase;
  private _searchUsersUseCase!: SearchUsersUseCase;
  private _createTodoUseCase!: CreateTodoUseCase;
  private _getTodosUseCase!: GetTodosUseCase;
  private _updateTodoUseCase!: UpdateTodoUseCase;
  private _updateTodoStatusUseCase!: UpdateTodoStatusUseCase;
  private _deleteTodoUseCase!: DeleteTodoUseCase;

  // Chat use cases
  private _createRoomUseCase!: CreateRoomUseCase;
  private _updateRoomUseCase!: UpdateRoomUseCase;
  private _getRoomsUseCase!: GetRoomsUseCase;
  private _getRoomUseCase!: GetRoomUseCase;
  private _deleteRoomUseCase!: DeleteRoomUseCase;
  private _joinRoomUseCase!: JoinRoomUseCase;
  private _leaveRoomUseCase!: LeaveRoomUseCase;
  private _inviteUsersUseCase!: InviteUsersUseCase;
  private _getRoomMembersUseCase!: GetRoomMembersUseCase;
  private _removeMemberUseCase!: RemoveMemberUseCase;
  private _createMessageUseCase!: CreateMessageUseCase;
  private _updateMessageUseCase!: UpdateMessageUseCase;
  private _getMessagesUseCase!: GetMessagesUseCase;
  private _deleteMessageUseCase!: DeleteMessageUseCase;

  // Presentation
  private _authController!: AuthController;
  private _todoController!: TodoController;
  private _chatController!: ChatController;
  private _userController!: UserController;
  private _authRoutes!: AuthRoutes;
  private _todoRoutes!: TodoRoutes;
  private _chatRoutes!: ChatRoutes;
  private _userRoutes!: UserRoutes;

  private constructor() {}

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  public async initialize(socketService?: SocketService): Promise<void> {
    // Initialize database connection
    this._databaseConnection = await DatabaseConnectionFactory.create();
    await this._databaseConnection.connect();

    // Store socket service if provided
    if (socketService) {
      this._socketService = socketService;
    }

    // Initialize repositories
    if (this._databaseConnection instanceof SQLiteConnection) {
      this._userRepository = new SQLiteUserRepository(this._databaseConnection);
      this._todoRepository = new SQLiteTodoRepository(this._databaseConnection);
      this._roomRepository = new SQLiteRoomRepository(this._databaseConnection.getDatabase());
      this._messageRepository = new SQLiteMessageRepository(this._databaseConnection.getDatabase());
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
    this._logoutUseCase = new LogoutUseCase(
      this._userRepository,
      this._roomRepository,
      this._socketService
    );
    this._getUserUseCase = new GetUserUseCase(this._userRepository);
    this._updateUserUseCase = new UpdateUserUseCase(this._userRepository);
    this._refreshTokenUseCase = new RefreshTokenUseCase(this._tokenService, this._userRepository);
    this._searchUsersUseCase = new SearchUsersUseCase(this._userRepository);
    this._createTodoUseCase = new CreateTodoUseCase(this._todoRepository);
    this._getTodosUseCase = new GetTodosUseCase(this._todoRepository);
    this._updateTodoUseCase = new UpdateTodoUseCase(this._todoRepository);
    this._updateTodoStatusUseCase = new UpdateTodoStatusUseCase(this._todoRepository);
    this._deleteTodoUseCase = new DeleteTodoUseCase(this._todoRepository);

    // Initialize chat use cases
    this._createRoomUseCase = new CreateRoomUseCase(this._roomRepository);
    this._updateRoomUseCase = new UpdateRoomUseCase(this._roomRepository, this._socketService);
    this._getRoomsUseCase = new GetRoomsUseCase(this._roomRepository);
    this._getRoomUseCase = new GetRoomUseCase(this._roomRepository);
    this._deleteRoomUseCase = new DeleteRoomUseCase(this._roomRepository, this._messageRepository, this._socketService);
    this._joinRoomUseCase = new JoinRoomUseCase(this._roomRepository);
    this._leaveRoomUseCase = new LeaveRoomUseCase(this._roomRepository);
    this._inviteUsersUseCase = new InviteUsersUseCase(this._roomRepository, this._userRepository);
    this._getRoomMembersUseCase = new GetRoomMembersUseCase(this._roomRepository, this._userRepository);
    this._removeMemberUseCase = new RemoveMemberUseCase(this._roomRepository, this._userRepository, this._socketService);
    this._createMessageUseCase = new CreateMessageUseCase(this._messageRepository, this._roomRepository);
    this._updateMessageUseCase = new UpdateMessageUseCase(this._messageRepository);
    this._getMessagesUseCase = new GetMessagesUseCase(this._messageRepository, this._roomRepository, this._userRepository);
    this._deleteMessageUseCase = new DeleteMessageUseCase(this._messageRepository);

    // Initialize controllers
    this._authController = new AuthController(
      this._registerUseCase,
      this._loginUseCase,
      this._logoutUseCase,
      this._getUserUseCase,
      this._updateUserUseCase,
      this._refreshTokenUseCase
    );
    this._todoController = new TodoController(
      this._createTodoUseCase,
      this._getTodosUseCase,
      this._updateTodoUseCase,
      this._updateTodoStatusUseCase,
      this._deleteTodoUseCase,
      this._todoRepository
    );

    this._userController = new UserController(
      this._searchUsersUseCase,
      this._roomRepository
    );

    // Initialize chat controller (only if socket service is available)
    if (this._socketService) {
      this._chatController = new ChatController(
        this._createRoomUseCase,
        this._updateRoomUseCase,
        this._getRoomsUseCase,
        this._getRoomUseCase,
        this._deleteRoomUseCase,
        this._joinRoomUseCase,
        this._leaveRoomUseCase,
        this._inviteUsersUseCase,
        this._getRoomMembersUseCase,
        this._removeMemberUseCase,
        this._createMessageUseCase,
        this._updateMessageUseCase,
        this._getMessagesUseCase,
        this._deleteMessageUseCase,
        this._socketService
      );

      // Set chat controller in socket service to avoid circular dependency
      this._socketService.setChatController(this._chatController);
    }

    // Initialize routes
    this._authRoutes = new AuthRoutes(this._authController, this._authMiddleware);
    this._todoRoutes = new TodoRoutes(this._todoController, this._authMiddleware);
    this._userRoutes = new UserRoutes(this._userController, this._authMiddleware);

    if (this._chatController) {
      this._chatRoutes = new ChatRoutes(this._chatController, this._authMiddleware);
    }
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

  public get userRoutes(): UserRoutes {
    return this._userRoutes;
  }

  public get authMiddleware(): AuthMiddleware {
    return this._authMiddleware;
  }

  public get chatRoutes(): ChatRoutes {
    return this._chatRoutes;
  }

  public get socketService(): SocketService {
    return this._socketService;
  }
}
