#!/usr/bin/env ts-node

/**
 * Seed Demo Data Script
 * Creates a demo user and sample todos for testing and demonstration purposes
 */

import { User } from '@domain/entities/User';
import { Todo } from '@domain/entities/Todo';
import { PasswordService } from '@infrastructure/external-services/PasswordService';
import { SQLiteConnection } from '@infrastructure/database/SQLiteConnection';
import { SQLiteUserRepository } from '@infrastructure/repositories/SQLiteUserRepository';
import { SQLiteTodoRepository } from '@infrastructure/repositories/SQLiteTodoRepository';
import { TODO_STATUS, TodoStatus } from '@shared/constants';

// Demo user credentials
const DEMO_USER = {
  username: 'john',
  email: 'john@example.com',
  password: 'Password123',
  avatarUrl: 'https://avatars.dicebear.com/api/avataaars/john.svg'
};

// Sample todos for the demo user with valid status transitions
interface SampleTodo {
  title: string;
  content: string;
  status?: TodoStatus;
  transitions?: TodoStatus[];
}

const SAMPLE_TODOS: SampleTodo[] = [
  {
    title: '🚀 Welcome to Todo App',
    content: 'This is your first todo! You can create, edit, and manage your tasks here. Try changing the status of this todo.',
    status: TODO_STATUS.INITIAL
  },
  {
    title: '📝 Learn the Todo Workflow',
    content: 'Explore different todo statuses: Initial → Todo → Doing → Review → Done → Keeping. Each status represents a different stage in your workflow.',
    status: TODO_STATUS.TODO
  },
  {
    title: '🎯 Set Up Your Workspace',
    content: 'Customize your profile, upload an avatar, and organize your todos. Make this app work for your productivity needs.',
    status: TODO_STATUS.DOING
  },
  {
    title: '🔍 Review App Features',
    content: 'Check out the filtering, sorting, and pagination features. You can filter todos by status and sort them by different criteria.',
    transitions: [TODO_STATUS.TODO, TODO_STATUS.REVIEW] // TODO first, then REVIEW
  },
  {
    title: '✅ Complete Your First Task',
    content: 'Congratulations! You have successfully completed your first task. This todo demonstrates the "Done" status.',
    transitions: [TODO_STATUS.TODO, TODO_STATUS.DOING, TODO_STATUS.DONE] // TODO → DOING → DONE
  },
  {
    title: '📚 Read Documentation',
    content: 'Visit the API documentation at /api-docs to learn about all available endpoints and features.',
    status: TODO_STATUS.KEEPING
  },
  {
    title: '🎨 Customize Your Experience',
    content: 'Explore the UI components and see how the app handles different todo states and user interactions.',
    status: TODO_STATUS.INITIAL
  },
  {
    title: '🔧 Test API Endpoints',
    content: 'Use the Swagger UI to test different API endpoints. Try creating, updating, and deleting todos through the API.',
    status: TODO_STATUS.TODO
  },
  {
    title: '🌟 Share Your Feedback',
    content: 'Let us know what you think about the app! Your feedback helps us improve the user experience.',
    status: TODO_STATUS.INITIAL
  },
  {
    title: '🚀 Deploy Your Own Instance',
    content: 'Follow the deployment guide to set up your own instance of this todo application.',
    status: TODO_STATUS.CANCELLED
  }
];

class DemoDataSeeder {
  private passwordService: PasswordService;
  private dbConnection: SQLiteConnection | null = null;
  private userRepository: SQLiteUserRepository | null = null;
  private todoRepository: SQLiteTodoRepository | null = null;

  constructor() {
    this.passwordService = new PasswordService();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize database connection
      this.dbConnection = new SQLiteConnection();
      await this.dbConnection.connect();

      // Initialize repositories
      this.userRepository = new SQLiteUserRepository(this.dbConnection);
      this.todoRepository = new SQLiteTodoRepository(this.dbConnection);

      console.log('✅ Database connection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      throw error;
    }
  }

  async checkIfDemoUserExists(): Promise<boolean> {
    try {
      if (!this.userRepository) throw new Error('User repository not initialized');
      const existingUser = await this.userRepository.findByEmail(DEMO_USER.email);
      return existingUser !== null;
    } catch (error) {
      console.error('❌ Error checking demo user:', error);
      return false;
    }
  }

  async createDemoUser(): Promise<User> {
    try {
      if (!this.userRepository) throw new Error('User repository not initialized');
      
      console.log('👤 Creating demo user...');
      
      // Hash the password
      const hashedPassword = await this.passwordService.hash(DEMO_USER.password);
      
      // Create user entity
      const user = User.create({
        username: DEMO_USER.username,
        email: DEMO_USER.email,
        password: hashedPassword,
        avatarUrl: DEMO_USER.avatarUrl
      });

      // Save to database
      await this.userRepository.create(user);
      
      console.log(`✅ Demo user created successfully!`);
      console.log(`   Username: ${DEMO_USER.username}`);
      console.log(`   Email: ${DEMO_USER.email}`);
      console.log(`   Password: ${DEMO_USER.password}`);
      
      return user;
    } catch (error) {
      console.error('❌ Failed to create demo user:', error);
      throw error;
    }
  }

  async createSampleTodos(userId: string): Promise<Todo[]> {
    try {
      if (!this.todoRepository) throw new Error('Todo repository not initialized');
      
      console.log('📝 Creating sample todos...');
      
      const createdTodos: Todo[] = [];
      
      for (const todoData of SAMPLE_TODOS) {
        // Create todo entity
        const todo = Todo.create({
          title: todoData.title,
          content: todoData.content,
          userId: userId
        });

        // Handle status transitions
        if (todoData.transitions) {
          // Apply multiple transitions in sequence
          for (const status of todoData.transitions) {
            todo.changeStatus(status);
          }
        } else if (todoData.status && todoData.status !== TODO_STATUS.INITIAL) {
          // Single status change
          todo.changeStatus(todoData.status);
        }

        // Save to database
        await this.todoRepository.create(todo);
        createdTodos.push(todo);

        const finalStatus = todoData.transitions ? todoData.transitions[todoData.transitions.length - 1] : todoData.status;
        console.log(`   ✓ Created: ${todoData.title} (${finalStatus})`);
      }
      
      console.log(`✅ Created ${createdTodos.length} sample todos`);
      return createdTodos;
    } catch (error) {
      console.error('❌ Failed to create sample todos:', error);
      throw error;
    }
  }

  async seed(force: boolean = false): Promise<void> {
    try {
      await this.initialize();
      
      // Check if demo user already exists
      const userExists = await this.checkIfDemoUserExists();
      
      if (userExists && !force) {
        console.log('⚠️  Demo user already exists. Use --force to recreate.');
        console.log(`   Login with: ${DEMO_USER.email} / ${DEMO_USER.password}`);
        return;
      }
      
      if (userExists && force) {
        console.log('🔄 Force mode: Removing existing demo user...');
        if (!this.userRepository) throw new Error('User repository not initialized');
        const existingUser = await this.userRepository.findByEmail(DEMO_USER.email);
        if (existingUser) {
          await this.userRepository.delete(existingUser.id);
          console.log('✅ Existing demo user removed');
        }
      }
      
      // Create demo user
      const demoUser = await this.createDemoUser();
      
      // Create sample todos
      await this.createSampleTodos(demoUser.id);
      
      console.log('\n🎉 Demo data seeded successfully!');
      console.log('\n📋 Login Information:');
      console.log(`   Email: ${DEMO_USER.email}`);
      console.log(`   Password: ${DEMO_USER.password}`);
      console.log('\n🌐 Access the application:');
      console.log('   Frontend: http://localhost:5173');
      console.log('   Backend: http://localhost:8080');
      console.log('   API Docs: http://localhost:8080/api-docs');
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    } finally {
      if (this.dbConnection) {
        await this.dbConnection.disconnect();
      }
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  
  console.log('🌱 Starting demo data seeding...');
  
  const seeder = new DemoDataSeeder();
  await seeder.seed(force);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
}

export { DemoDataSeeder, DEMO_USER, SAMPLE_TODOS };
