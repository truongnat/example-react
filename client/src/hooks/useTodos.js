var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todo.service';
// Query keys
export const todoKeys = {
    all: ['todos'],
    lists: () => [...todoKeys.all, 'list'],
    list: (params) => [...todoKeys.lists(), params],
    details: () => [...todoKeys.all, 'detail'],
    detail: (id) => [...todoKeys.details(), id],
};
// Get todos query
export const useTodos = (params) => {
    return useQuery({
        queryKey: todoKeys.list(params),
        queryFn: () => todoService.getTodos(params),
        staleTime: 30 * 1000, // 30 seconds
        retry: (failureCount, error) => {
            // Don't retry on 401 errors
            if ((error === null || error === void 0 ? void 0 : error.status) === 401)
                return false;
            return failureCount < 3;
        },
    });
};
// Get todo by ID query
export const useTodo = (id) => {
    return useQuery({
        queryKey: todoKeys.detail(id),
        queryFn: () => todoService.getTodoById(id),
        enabled: !!id,
        staleTime: 30 * 1000, // 30 seconds
    });
};
// Create todo mutation
export const useCreateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => todoService.createTodo(data),
        onSuccess: (newTodo) => {
            // Invalidate and refetch todos list
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            // Optionally add the new todo to existing cache
            queryClient.setQueryData(todoKeys.detail(newTodo.id), newTodo);
        },
        onError: (error) => {
            console.error('Failed to create todo:', error);
        },
    });
};
// Update todo mutation
export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => todoService.updateTodo(id, data),
        onSuccess: (updatedTodo) => {
            // Update the specific todo in cache
            queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
            // Invalidate todos list to reflect changes
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
        onError: (error) => {
            console.error('Failed to update todo:', error);
        },
    });
};
// Update todo status mutation
export const useUpdateTodoStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => todoService.updateTodoStatus(id, data),
        onSuccess: (updatedTodo) => {
            // Update the specific todo in cache
            queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
            // Invalidate todos list to reflect changes
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
        onError: (error) => {
            console.error('Failed to update todo status:', error);
        },
    });
};
// Delete todo mutation
export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => todoService.deleteTodo(id),
        onSuccess: (_, deletedId) => {
            // Remove the todo from cache
            queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
            // Invalidate todos list to reflect changes
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
        onError: (error) => {
            console.error('Failed to delete todo:', error);
        },
    });
};
// Optimistic update for todo status (for better UX)
export const useToggleTodoStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, currentStatus }) {
            // Determine new status
            const newStatus = currentStatus === 'completed' ? 'initial' : 'completed';
            return todoService.updateTodoStatus(id, { status: newStatus });
        }),
        onMutate: (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, currentStatus }) {
            // Cancel outgoing refetches
            yield queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });
            // Snapshot previous value
            const previousTodo = queryClient.getQueryData(todoKeys.detail(id));
            // Optimistically update
            if (previousTodo) {
                const newStatus = currentStatus === 'completed' ? 'initial' : 'completed';
                queryClient.setQueryData(todoKeys.detail(id), Object.assign(Object.assign({}, previousTodo), { status: newStatus }));
            }
            return { previousTodo };
        }),
        onError: (error, variables, context) => {
            // Rollback on error
            if (context === null || context === void 0 ? void 0 : context.previousTodo) {
                queryClient.setQueryData(todoKeys.detail(variables.id), context.previousTodo);
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
};
