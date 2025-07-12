import request from 'supertest';
import { Express } from 'express';
import { setupTestApp, resetTestDatabase } from '../../utils/helpers/test-app.helper';
import { TODO_STATUS } from '@shared/constants';

describe('Todo Management Flow E2E Tests', () => {
  let app: Express;
  let userTokens: any;
  let userId: string;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();

    // Register and login user for each test with unique identifiers
    const timestamp = Date.now();
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: `todouser_${timestamp}`,
        email: `todo_${timestamp}@example.com`,
        password: 'Password123',
      });

    if (registerResponse.status !== 201) {
      throw new Error(`Register failed with status ${registerResponse.status}: ${JSON.stringify(registerResponse.body)}`);
    }

    userTokens = registerResponse.body.data.tokens;
    userId = registerResponse.body.data.user.id;
  });

  describe('Complete Todo Management Flow', () => {
    it('should complete full todo lifecycle: create -> read -> update -> status change -> delete', async () => {
      // Step 1: Create a new todo
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'E2E Test Todo',
          content: 'This is a test todo for E2E testing',
        })
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.todo.title).toBe('E2E Test Todo');
      expect(createResponse.body.data.todo.status).toBe(TODO_STATUS.INITIAL);
      expect(createResponse.body.data.todo.userId).toBe(userId);

      const todoId = createResponse.body.data.todo.id;
      console.log('Created todoId:', todoId, 'Type:', typeof todoId);

      // Step 2: Get all todos (should include the created todo)
      const getTodosResponse = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      expect(getTodosResponse.body.data.todos).toHaveLength(1);
      expect(getTodosResponse.body.data.todos[0].id).toBe(todoId);
      expect(getTodosResponse.body.data.total).toBe(1);

      // Step 3: Get specific todo by ID
      const getTodoResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      if (getTodoResponse.status !== 200) {
        throw new Error(`Get todo failed with status ${getTodoResponse.status}: ${JSON.stringify(getTodoResponse.body)}`);
      }

      expect(getTodoResponse.body.data.todo.id).toBe(todoId);
      expect(getTodoResponse.body.data.todo.title).toBe('E2E Test Todo');

      // Step 4: Update todo content
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'Updated E2E Test Todo',
          content: 'This content has been updated',
        })
        .expect(200);

      expect(updateResponse.body.data.todo.title).toBe('Updated E2E Test Todo');
      expect(updateResponse.body.data.todo.content).toBe('This content has been updated');

      // Step 5: Change todo status from INITIAL to TODO
      const statusUpdateResponse1 = await request(app)
        .put(`/api/todos/${todoId}/status`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({ status: TODO_STATUS.TODO })
        .expect(200);

      expect(statusUpdateResponse1.body.data.todo.status).toBe(TODO_STATUS.TODO);

      // Step 6: Change status to DOING
      const statusUpdateResponse2 = await request(app)
        .put(`/api/todos/${todoId}/status`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({ status: TODO_STATUS.DOING })
        .expect(200);

      expect(statusUpdateResponse2.body.data.todo.status).toBe(TODO_STATUS.DOING);

      // Step 7: Complete the todo
      const statusUpdateResponse3 = await request(app)
        .put(`/api/todos/${todoId}/status`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({ status: TODO_STATUS.DONE })
        .expect(200);

      expect(statusUpdateResponse3.body.data.todo.status).toBe(TODO_STATUS.DONE);

      // Step 8: Verify todo appears in completed filter
      const completedTodosResponse = await request(app)
        .get('/api/todos')
        .query({ status: TODO_STATUS.DONE })
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      expect(completedTodosResponse.body.data.todos).toHaveLength(1);
      expect(completedTodosResponse.body.data.todos[0].status).toBe(TODO_STATUS.DONE);

      // Step 9: Delete the todo
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      // Step 10: Verify todo is deleted
      await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(404);

      // Step 11: Verify todo list is empty
      const finalTodosResponse = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      expect(finalTodosResponse.body.data.todos).toHaveLength(0);
      expect(finalTodosResponse.body.data.total).toBe(0);
    });

    it('should handle multiple todos with different statuses', async () => {
      // Create multiple todos with valid status transitions from INITIAL
      const todos = [
        { title: 'Todo 1', content: 'Content 1', status: TODO_STATUS.TODO },
        { title: 'Todo 2', content: 'Content 2', status: TODO_STATUS.DOING },
        { title: 'Todo 3', content: 'Content 3', status: TODO_STATUS.KEEPING },
        { title: 'Todo 4', content: 'Content 4', status: TODO_STATUS.CANCELLED },
      ];

      const createdTodos = [];

      for (const todo of todos) {
        const createResponse = await request(app)
          .post('/api/todos')
          .set('Authorization', `Bearer ${userTokens.accessToken}`)
          .send({ title: todo.title, content: todo.content })
          .expect(201);

        const todoId = createResponse.body.data.todo.id;
        createdTodos.push({ ...todo, id: todoId });

        // Update status (todos are created with INITIAL status by default)
        await request(app)
          .put(`/api/todos/${todoId}/status`)
          .set('Authorization', `Bearer ${userTokens.accessToken}`)
          .send({ status: todo.status })
          .expect(200);
      }

      // Test filtering by status
      for (const status of [TODO_STATUS.TODO, TODO_STATUS.DOING, TODO_STATUS.KEEPING, TODO_STATUS.CANCELLED]) {
        const filterResponse = await request(app)
          .get('/api/todos')
          .query({ status })
          .set('Authorization', `Bearer ${userTokens.accessToken}`)
          .expect(200);

        const expectedCount = todos.filter(t => t.status === status).length;
        expect(filterResponse.body.data.todos).toHaveLength(expectedCount);
        
        if (expectedCount > 0) {
          expect(filterResponse.body.data.todos[0].status).toBe(status);
        }
      }

      // Test pagination
      const paginatedResponse = await request(app)
        .get('/api/todos')
        .query({ page: 1, limit: 2 })
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      expect(paginatedResponse.body.data.todos).toHaveLength(2);
      expect(paginatedResponse.body.data.page).toBe(1);
      expect(paginatedResponse.body.data.limit).toBe(2);
      expect(paginatedResponse.body.data.total).toBe(4);
      expect(paginatedResponse.body.data.totalPages).toBe(2);

      // Test sorting
      const sortedResponse = await request(app)
        .get('/api/todos')
        .query({ sortBy: 'title', sortOrder: 'asc' })
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      const titles = sortedResponse.body.data.todos.map((t: any) => t.title);
      const sortedTitles = [...titles].sort();
      expect(titles).toEqual(sortedTitles);
    });

    it('should prevent unauthorized access to other users todos', async () => {
      // Create a todo with first user
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'Private Todo',
          content: 'This should be private',
        })
        .expect(201);

      const todoId = createResponse.body.data.todo.id;

      // Register second user with unique identifier
      const timestamp2 = Date.now() + 1;
      const secondUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: `seconduser_${timestamp2}`,
          email: `second_${timestamp2}@example.com`,
          password: 'Password123',
        })
        .expect(201);

      const secondUserTokens = secondUserResponse.body.data.tokens;

      // Second user should not see first user's todo
      const getTodosResponse = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${secondUserTokens.accessToken}`)
        .expect(200);

      expect(getTodosResponse.body.data.todos).toHaveLength(0);

      // Verify the todo still exists for the first user
      await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .expect(200);

      // Second user should not be able to access first user's todo directly
      // This should return 403 if todo exists but user doesn't own it, or 404 if todo doesn't exist
      const getResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${secondUserTokens.accessToken}`);

      expect([403, 404]).toContain(getResponse.status);

      // Second user should not be able to update first user's todo
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${secondUserTokens.accessToken}`)
        .send({ title: 'Hacked Todo' });

      expect([403, 404]).toContain(updateResponse.status);

      // Second user should not be able to delete first user's todo
      const deleteResponse = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${secondUserTokens.accessToken}`);

      expect([403, 404]).toContain(deleteResponse.status);
    });

    it('should handle todo validation errors', async () => {
      // Test empty title
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: '',
          content: 'Valid content',
        })
        .expect(400);

      // Test missing title
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          content: 'Valid content',
        })
        .expect(400);

      // Test title too long
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'a'.repeat(201), // Assuming max length is 200
          content: 'Valid content',
        })
        .expect(400);

      // Test content too long
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'Valid title',
          content: 'a'.repeat(2001), // Exceeds max length of 2000
        })
        .expect(400);

      // Test duplicate title
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'Duplicate Todo',
          content: 'First todo',
        })
        .expect(201);

      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send({
          title: 'Duplicate Todo',
          content: 'Second todo',
        })
        .expect(409);
    });
  });
});
