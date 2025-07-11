import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/stores/authStore';
import { useTodos, useCreateTodo, useUpdateTodoStatus, useDeleteTodo } from '@/hooks/useTodos';
import { TodoStatus } from '@/types/api';
import { Loader2, Trash2, Edit, Plus, CheckCircle } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading';
export const Route = createFileRoute('/todo')({
    beforeLoad: ({ context, location }) => {
        // Check if user is authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: TodoPage,
});
function TodoPage() {
    var _a;
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoContent, setNewTodoContent] = useState('');
    const [validationError, setValidationError] = useState('');
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    // Memoize params to prevent unnecessary refetches
    const todosParams = useMemo(() => ({
        status: statusFilter,
        sortBy,
        sortOrder,
        limit: 50
    }), [statusFilter, sortBy, sortOrder]);
    // React Query hooks
    const { data: todosData, isLoading, error, refetch } = useTodos(todosParams);
    const createTodoMutation = useCreateTodo();
    const updateStatusMutation = useUpdateTodoStatus();
    const deleteTodoMutation = useDeleteTodo();
    const validateForm = () => {
        if (!newTodoTitle.trim()) {
            setValidationError('Title is required');
            return false;
        }
        if (newTodoTitle.trim().length < 3) {
            setValidationError('Title must be at least 3 characters long');
            return false;
        }
        if (newTodoTitle.trim().length > 200) {
            setValidationError('Title must be less than 200 characters');
            return false;
        }
        if (newTodoContent.trim().length > 2000) {
            setValidationError('Content must be less than 2000 characters');
            return false;
        }
        setValidationError('');
        return true;
    };
    const handleCreateTodo = (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        createTodoMutation.mutate({
            title: newTodoTitle.trim(),
            content: newTodoContent.trim() || newTodoTitle.trim(),
        }, {
            onSuccess: () => {
                setNewTodoTitle('');
                setNewTodoContent('');
                setValidationError('');
            },
            onError: (error) => {
                setValidationError(error.message || 'Failed to create todo');
            }
        });
    };
    const handleToggleStatus = (todoId, currentStatus) => {
        const newStatus = currentStatus === TodoStatus.COMPLETED ? TodoStatus.INITIAL : TodoStatus.COMPLETED;
        updateStatusMutation.mutate({ id: todoId, data: { status: newStatus } });
    };
    const handleDeleteTodo = (todoId) => {
        if (confirm('Are you sure you want to delete this todo?')) {
            deleteTodoMutation.mutate(todoId);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, { title: "Todo App" }), _jsx("div", { className: "py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Todo Manager" }), _jsx("p", { className: "text-gray-600", children: "Organize your tasks and boost productivity" })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Add New Task" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleCreateTodo, className: "space-y-4", children: [(validationError || createTodoMutation.error) && (_jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: validationError || ((_a = createTodoMutation.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to create todo' })), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "Enter task title...", value: newTodoTitle, onChange: (e) => {
                                                            setNewTodoTitle(e.target.value);
                                                            if (validationError)
                                                                setValidationError('');
                                                        }, className: "flex-1", required: true, maxLength: 200 }), _jsx(Button, { type: "submit", disabled: createTodoMutation.isPending || !newTodoTitle.trim(), children: createTodoMutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Task"] })) })] }), _jsx(Input, { placeholder: "Enter task description (optional)...", value: newTodoContent, onChange: (e) => setNewTodoContent(e.target.value), maxLength: 2000 }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Title: ", newTodoTitle.length, "/200 characters", newTodoContent && ` • Description: ${newTodoContent.length}/2000 characters`] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Your Tasks" }), todosData && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [todosData.total, " total \u2022 ", todosData.todos.filter(t => t.status === TodoStatus.COMPLETED).length, " completed"] }))] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsxs("select", { value: statusFilter || '', onChange: (e) => setStatusFilter(e.target.value || undefined), className: "px-2 py-1 border rounded", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: TodoStatus.INITIAL, children: "Initial" }), _jsx("option", { value: TodoStatus.IN_PROGRESS, children: "In Progress" }), _jsx("option", { value: TodoStatus.COMPLETED, children: "Completed" }), _jsx("option", { value: TodoStatus.CANCELLED, children: "Cancelled" })] }), _jsxs("select", { value: `${sortBy}-${sortOrder}`, onChange: (e) => {
                                                            const [field, order] = e.target.value.split('-');
                                                            setSortBy(field);
                                                            setSortOrder(order);
                                                        }, className: "px-2 py-1 border rounded", children: [_jsx("option", { value: "createdAt-desc", children: "Newest First" }), _jsx("option", { value: "createdAt-asc", children: "Oldest First" }), _jsx("option", { value: "title-asc", children: "Title A-Z" }), _jsx("option", { value: "title-desc", children: "Title Z-A" }), _jsx("option", { value: "status-asc", children: "Status A-Z" })] })] })] }) }), _jsx(CardContent, { children: isLoading ? (_jsx(LoadingState, { message: "Loading tasks..." })) : error ? (_jsx(ErrorState, { message: "Failed to load tasks", error: error, onRetry: () => refetch() })) : (todosData === null || todosData === void 0 ? void 0 : todosData.todos) && todosData.todos.length > 0 ? (_jsx("div", { className: "space-y-3", children: todosData.todos.map((todo) => (_jsxs("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [_jsx(Checkbox, { id: `task-${todo.id}`, checked: todo.status === TodoStatus.COMPLETED, onCheckedChange: () => handleToggleStatus(todo.id, todo.status), disabled: updateStatusMutation.isPending }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: `task-${todo.id}`, className: `block text-sm font-medium ${todo.status === TodoStatus.COMPLETED
                                                                ? 'line-through text-gray-500'
                                                                : 'text-gray-900'}`, children: todo.title }), todo.content !== todo.title && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: todo.content })), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Created: ", new Date(todo.createdAt).toLocaleDateString()] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                                        // TODO: Implement edit functionality
                                                        alert('Edit functionality coming soon!');
                                                    }, children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleDeleteTodo(todo.id), disabled: deleteTodoMutation.isPending, children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, todo.id))) })) : (_jsx(EmptyState, { message: "No tasks yet", description: "Create your first task above to get started!", icon: _jsx(CheckCircle, { className: "w-12 h-12 mx-auto text-gray-400" }) })) })] })] }) })] }));
}
