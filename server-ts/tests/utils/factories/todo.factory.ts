import { Todo, TodoProps } from '@domain/entities/Todo';
import { TodoStatus, TODO_STATUS } from '@shared/constants';
import { UUID } from '@shared/types/common.types';

export interface TodoFactoryOptions {
  id?: UUID;
  title?: string;
  content?: string;
  status?: TodoStatus;
  userId?: UUID;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TodoFactory {
  private static defaultProps: Partial<TodoProps> = {
    title: 'Test Todo',
    content: 'This is a test todo item',
    userId: 'test-user-id',
  };

  static create(options: TodoFactoryOptions = {}): Todo {
    const props = {
      ...this.defaultProps,
      ...options,
    };

    // If we have all required props, use fromPersistence, otherwise use create
    if (options.id && options.createdAt && options.updatedAt && options.status) {
      return Todo.fromPersistence(props as any);
    }

    const todo = Todo.create(props as any);

    // Set additional properties if provided
    if (options.id) {
      (todo as any)._id = options.id;
    }

    if (options.status) {
      todo.changeStatus(options.status);
    }

    if (options.createdAt) {
      (todo as any)._createdAt = options.createdAt;
    }

    if (options.updatedAt) {
      (todo as any)._updatedAt = options.updatedAt;
    }

    return todo;
  }

  static createMany(count: number, options: TodoFactoryOptions = {}): Todo[] {
    return Array.from({ length: count }, (_, index) => 
      this.create({
        ...options,
        title: `${options.title || 'Test Todo'} ${index + 1}`,
        content: `${options.content || 'This is a test todo item'} ${index + 1}`,
      })
    );
  }

  static createTodo(options: TodoFactoryOptions = {}): Todo {
    return this.create({
      ...options,
      status: TODO_STATUS.TODO,
    });
  }

  static createDone(options: TodoFactoryOptions = {}): Todo {
    return this.create({
      ...options,
      status: TODO_STATUS.DONE,
    });
  }

  static createForUser(userId: UUID, options: TodoFactoryOptions = {}): Todo {
    return this.create({
      ...options,
      userId,
    });
  }

  static createManyForUser(userId: UUID, count: number, options: TodoFactoryOptions = {}): Todo[] {
    return this.createMany(count, {
      ...options,
      userId,
    });
  }
}
