var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { httpClient } from '@/lib/http-client';
export class TodoService {
    getTodos(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams();
            if (params === null || params === void 0 ? void 0 : params.page)
                searchParams.append('page', params.page.toString());
            if (params === null || params === void 0 ? void 0 : params.limit)
                searchParams.append('limit', params.limit.toString());
            if (params === null || params === void 0 ? void 0 : params.status)
                searchParams.append('status', params.status);
            if (params === null || params === void 0 ? void 0 : params.sortBy)
                searchParams.append('sortBy', params.sortBy);
            if (params === null || params === void 0 ? void 0 : params.sortOrder)
                searchParams.append('sortOrder', params.sortOrder);
            const queryString = searchParams.toString();
            const endpoint = `/todos${queryString ? `?${queryString}` : ''}`;
            const response = yield httpClient.get(endpoint);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch todos');
        });
    }
    getTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.get(`/todos/${id}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch todo');
        });
    }
    createTodo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/todos', data);
            if (response.success && response.data) {
                return response.data.todo;
            }
            throw new Error(response.message || 'Failed to create todo');
        });
    }
    updateTodo(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.put(`/todos/${id}`, data);
            if (response.success && response.data) {
                return response.data.todo;
            }
            throw new Error(response.message || 'Failed to update todo');
        });
    }
    updateTodoStatus(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use the general update endpoint with status in body
            const response = yield httpClient.put(`/todos/${id}`, data);
            if (response.success && response.data) {
                return response.data.todo;
            }
            throw new Error(response.message || 'Failed to update todo status');
        });
    }
    deleteTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.delete(`/todos/${id}`);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete todo');
            }
        });
    }
}
// Export singleton instance
export const todoService = new TodoService();
