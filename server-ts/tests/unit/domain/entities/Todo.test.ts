import { Todo } from '@domain/entities/Todo';
import { TODO_STATUS } from '@shared/constants';

describe('Todo Entity', () => {
  const mockTodoData = {
    title: 'Test Todo',
    content: 'This is a test todo content',
    userId: 'user-123',
  };

  describe('create', () => {
    it('should create a new todo with default values', () => {
      const todo = Todo.create(mockTodoData);

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe(mockTodoData.title);
      expect(todo.content).toBe(mockTodoData.content);
      expect(todo.userId).toBe(mockTodoData.userId);
      expect(todo.status).toBe(TODO_STATUS.INITIAL);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });

    it('should create todo with unique IDs', () => {
      const todo1 = Todo.create(mockTodoData);
      const todo2 = Todo.create(mockTodoData);

      expect(todo1.id).not.toBe(todo2.id);
    });
  });

  describe('fromPersistence', () => {
    it('should create todo from persistence data', () => {
      const persistenceData = {
        id: 'todo-123',
        title: 'Persisted Todo',
        content: 'Persisted content',
        status: TODO_STATUS.TODO,
        userId: 'user-123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const todo = Todo.fromPersistence(persistenceData);

      expect(todo.id).toBe(persistenceData.id);
      expect(todo.title).toBe(persistenceData.title);
      expect(todo.content).toBe(persistenceData.content);
      expect(todo.status).toBe(persistenceData.status);
      expect(todo.userId).toBe(persistenceData.userId);
      expect(todo.createdAt).toEqual(persistenceData.createdAt);
      expect(todo.updatedAt).toEqual(persistenceData.updatedAt);
    });
  });

  describe('business methods', () => {
    let todo: Todo;

    beforeEach(() => {
      todo = Todo.create(mockTodoData);
    });

    describe('updateContent', () => {
      it('should update title only', async () => {
        const newTitle = 'Updated Title';
        const originalContent = todo.content;
        const originalUpdatedAt = todo.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 1));
        
        todo.updateContent(newTitle);

        expect(todo.title).toBe(newTitle);
        expect(todo.content).toBe(originalContent);
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should update content only', async () => {
        const newContent = 'Updated content';
        const originalTitle = todo.title;
        const originalUpdatedAt = todo.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        todo.updateContent(undefined, newContent);

        expect(todo.title).toBe(originalTitle);
        expect(todo.content).toBe(newContent);
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should update both title and content', async () => {
        const newTitle = 'Updated Title';
        const newContent = 'Updated content';
        const originalUpdatedAt = todo.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 1));
        
        todo.updateContent(newTitle, newContent);

        expect(todo.title).toBe(newTitle);
        expect(todo.content).toBe(newContent);
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should not update if no parameters provided', () => {
        const originalTitle = todo.title;
        const originalContent = todo.content;
        const originalUpdatedAt = todo.updatedAt;

        todo.updateContent();

        expect(todo.title).toBe(originalTitle);
        expect(todo.content).toBe(originalContent);
        expect(todo.updatedAt).toEqual(originalUpdatedAt);
      });
    });

    describe('status transitions', () => {
      it('should allow valid status transitions from INITIAL', () => {
        expect(todo.status).toBe(TODO_STATUS.INITIAL);

        todo.markAsTodo();
        expect(todo.status).toBe(TODO_STATUS.TODO);

        // Reset to initial
        todo = Todo.create(mockTodoData);
        todo.markAsKeeping();
        expect(todo.status).toBe(TODO_STATUS.KEEPING);
      });

      it('should allow valid status transitions from TODO', () => {
        todo.markAsTodo();
        expect(todo.status).toBe(TODO_STATUS.TODO);

        todo.markAsReview();
        expect(todo.status).toBe(TODO_STATUS.REVIEW);

        // Reset to TODO
        todo.changeStatus(TODO_STATUS.TODO);
        todo.markAsDone();
        expect(todo.status).toBe(TODO_STATUS.DONE);

        // Reset to TODO
        todo.changeStatus(TODO_STATUS.TODO);
        todo.markAsKeeping();
        expect(todo.status).toBe(TODO_STATUS.KEEPING);
      });

      it('should allow valid status transitions from REVIEW', () => {
        todo.markAsTodo();
        todo.markAsReview();
        expect(todo.status).toBe(TODO_STATUS.REVIEW);

        todo.markAsTodo();
        expect(todo.status).toBe(TODO_STATUS.TODO);

        // Reset to REVIEW
        todo.markAsReview();
        todo.markAsDone();
        expect(todo.status).toBe(TODO_STATUS.DONE);

        // Reset to TODO then REVIEW (can't go directly from DONE to REVIEW)
        todo.markAsTodo();
        todo.markAsReview();
        todo.markAsKeeping();
        expect(todo.status).toBe(TODO_STATUS.KEEPING);
      });

      it('should allow valid status transitions from DONE', () => {
        todo.markAsTodo();
        todo.markAsDone();
        expect(todo.status).toBe(TODO_STATUS.DONE);

        todo.markAsKeeping();
        expect(todo.status).toBe(TODO_STATUS.KEEPING);

        // Reset to DONE
        todo.changeStatus(TODO_STATUS.DONE);
        todo.markAsTodo();
        expect(todo.status).toBe(TODO_STATUS.TODO);
      });

      it('should allow valid status transitions from KEEPING', () => {
        todo.markAsKeeping();
        expect(todo.status).toBe(TODO_STATUS.KEEPING);

        todo.markAsTodo();
        expect(todo.status).toBe(TODO_STATUS.TODO);

        // Reset to KEEPING
        todo.markAsKeeping();
        todo.markAsDone();
        expect(todo.status).toBe(TODO_STATUS.DONE);
      });

      it('should throw error for invalid status transitions', () => {
        expect(todo.status).toBe(TODO_STATUS.INITIAL);

        expect(() => todo.changeStatus(TODO_STATUS.REVIEW)).toThrow(
          'Invalid status transition from initial to review'
        );

        expect(() => todo.changeStatus(TODO_STATUS.DONE)).toThrow(
          'Invalid status transition from initial to done'
        );
      });

      it('should update timestamp when status changes', async () => {
        const originalUpdatedAt = todo.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        todo.markAsTodo();

        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('utility methods', () => {
      it('should correctly identify ownership', () => {
        expect(todo.isOwnedBy(mockTodoData.userId)).toBe(true);
        expect(todo.isOwnedBy('different-user')).toBe(false);
      });

      it('should correctly identify done status', () => {
        expect(todo.isDone()).toBe(false);

        todo.markAsTodo();
        todo.markAsDone();
        expect(todo.isDone()).toBe(true);
      });

      it('should correctly identify in-progress status', () => {
        expect(todo.isInProgress()).toBe(false);

        todo.markAsTodo();
        expect(todo.isInProgress()).toBe(true);

        todo.markAsReview();
        expect(todo.isInProgress()).toBe(true);

        todo.markAsDone();
        expect(todo.isInProgress()).toBe(false);

        todo.markAsKeeping();
        expect(todo.isInProgress()).toBe(false);
      });
    });
  });

  describe('toJSON', () => {
    it('should return complete todo data', () => {
      const todo = Todo.create(mockTodoData);
      const json = todo.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('title');
      expect(json).toHaveProperty('content');
      expect(json).toHaveProperty('status');
      expect(json).toHaveProperty('userId');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');

      expect(json.title).toBe(mockTodoData.title);
      expect(json.content).toBe(mockTodoData.content);
      expect(json.userId).toBe(mockTodoData.userId);
      expect(json.status).toBe(TODO_STATUS.INITIAL);
    });
  });
});
