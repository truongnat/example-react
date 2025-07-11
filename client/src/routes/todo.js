import { createFileRoute, redirect } from '@tanstack/react-router';
import React, { useState, useMemo } from 'react';
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
    return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
        React.createElement(Navigation, { title: "Todo App" }),
        React.createElement("div", { className: "py-8" },
            React.createElement("div", { className: "max-w-2xl mx-auto px-4" },
                React.createElement("div", { className: "text-center mb-8" },
                    React.createElement("h1", { className: "text-3xl font-bold text-gray-900 mb-2" }, "Todo Manager"),
                    React.createElement("p", { className: "text-gray-600" }, "Organize your tasks and boost productivity")),
                React.createElement(Card, { className: "mb-6" },
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Add New Task")),
                    React.createElement(CardContent, null,
                        React.createElement("form", { onSubmit: handleCreateTodo, className: "space-y-4" },
                            (validationError || createTodoMutation.error) && (React.createElement("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md" }, validationError || ((_a = createTodoMutation.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to create todo')),
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement(Input, { placeholder: "Enter task title...", value: newTodoTitle, onChange: (e) => {
                                        setNewTodoTitle(e.target.value);
                                        if (validationError)
                                            setValidationError('');
                                    }, className: "flex-1", required: true, maxLength: 200 }),
                                React.createElement(Button, { type: "submit", disabled: createTodoMutation.isPending || !newTodoTitle.trim() }, createTodoMutation.isPending ? (React.createElement(Loader2, { className: "w-4 h-4 animate-spin" })) : (React.createElement(React.Fragment, null,
                                    React.createElement(Plus, { className: "w-4 h-4 mr-2" }),
                                    "Add Task")))),
                            React.createElement(Input, { placeholder: "Enter task description (optional)...", value: newTodoContent, onChange: (e) => setNewTodoContent(e.target.value), maxLength: 2000 }),
                            React.createElement("div", { className: "text-xs text-gray-500" },
                                "Title: ",
                                newTodoTitle.length,
                                "/200 characters",
                                newTodoContent && ` • Description: ${newTodoContent.length}/2000 characters`)))),
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", null,
                                React.createElement(CardTitle, null, "Your Tasks"),
                                todosData && (React.createElement("p", { className: "text-sm text-gray-600 mt-1" },
                                    todosData.total,
                                    " total \u2022 ",
                                    todosData.todos.filter(t => t.status === TodoStatus.COMPLETED).length,
                                    " completed"))),
                            React.createElement("div", { className: "flex items-center gap-2 text-sm" },
                                React.createElement("select", { value: statusFilter || '', onChange: (e) => setStatusFilter(e.target.value || undefined), className: "px-2 py-1 border rounded" },
                                    React.createElement("option", { value: "" }, "All Status"),
                                    React.createElement("option", { value: TodoStatus.INITIAL }, "Initial"),
                                    React.createElement("option", { value: TodoStatus.IN_PROGRESS }, "In Progress"),
                                    React.createElement("option", { value: TodoStatus.COMPLETED }, "Completed"),
                                    React.createElement("option", { value: TodoStatus.CANCELLED }, "Cancelled")),
                                React.createElement("select", { value: `${sortBy}-${sortOrder}`, onChange: (e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }, className: "px-2 py-1 border rounded" },
                                    React.createElement("option", { value: "createdAt-desc" }, "Newest First"),
                                    React.createElement("option", { value: "createdAt-asc" }, "Oldest First"),
                                    React.createElement("option", { value: "title-asc" }, "Title A-Z"),
                                    React.createElement("option", { value: "title-desc" }, "Title Z-A"),
                                    React.createElement("option", { value: "status-asc" }, "Status A-Z"))))),
                    React.createElement(CardContent, null, isLoading ? (React.createElement(LoadingState, { message: "Loading tasks..." })) : error ? (React.createElement(ErrorState, { message: "Failed to load tasks", error: error, onRetry: () => refetch() })) : (todosData === null || todosData === void 0 ? void 0 : todosData.todos) && todosData.todos.length > 0 ? (React.createElement("div", { className: "space-y-3" }, todosData.todos.map((todo) => (React.createElement("div", { key: todo.id, className: "flex items-center space-x-3 p-3 border rounded-lg" },
                        React.createElement(Checkbox, { id: `task-${todo.id}`, checked: todo.status === TodoStatus.COMPLETED, onCheckedChange: () => handleToggleStatus(todo.id, todo.status), disabled: updateStatusMutation.isPending }),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { htmlFor: `task-${todo.id}`, className: `block text-sm font-medium ${todo.status === TodoStatus.COMPLETED
                                    ? 'line-through text-gray-500'
                                    : 'text-gray-900'}` }, todo.title),
                            todo.content !== todo.title && (React.createElement("p", { className: "text-xs text-gray-600 mt-1" }, todo.content)),
                            React.createElement("p", { className: "text-xs text-gray-400 mt-1" },
                                "Created: ",
                                new Date(todo.createdAt).toLocaleDateString())),
                        React.createElement(Button, { variant: "outline", size: "sm", onClick: () => {
                                // TODO: Implement edit functionality
                                alert('Edit functionality coming soon!');
                            } },
                            React.createElement(Edit, { className: "w-4 h-4" })),
                        React.createElement(Button, { variant: "destructive", size: "sm", onClick: () => handleDeleteTodo(todo.id), disabled: deleteTodoMutation.isPending },
                            React.createElement(Trash2, { className: "w-4 h-4" }))))))) : (React.createElement(EmptyState, { message: "No tasks yet", description: "Create your first task above to get started!", icon: React.createElement(CheckCircle, { className: "w-12 h-12 mx-auto text-gray-400" }) }))))))));
}
