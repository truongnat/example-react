var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateRoom } from '@/hooks/useChat';
const createRoomSchema = z.object({
    name: z
        .string()
        .min(1, 'Room name is required')
        .max(100, 'Room name must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Room name can only contain letters, numbers, spaces, hyphens, and underscores'),
    avatarUrl: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
});
export function CreateRoomDialog({ open, onOpenChange }) {
    const createRoomMutation = useCreateRoom();
    const form = useForm({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            name: '',
            avatarUrl: '',
        },
    });
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield createRoomMutation.mutateAsync({
                name: data.name,
                avatarUrl: data.avatarUrl || undefined,
            });
            // Close dialog and reset form
            onOpenChange(false);
            form.reset();
        }
        catch (error) {
            // Error is handled by the mutation
            console.error('Failed to create room:', error);
        }
    });
    const handleClose = () => {
        if (!createRoomMutation.isPending) {
            onOpenChange(false);
            form.reset();
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New Room" }), _jsx(DialogDescription, { children: "Create a new chat room to start conversations with your team." })] }), _jsx(Form, Object.assign({}, form, { children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Room Name" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "Enter room name..." }, field, { disabled: createRoomMutation.isPending })) }), _jsx(FormDescription, { children: "Choose a descriptive name for your room." }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "avatarUrl", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Avatar URL (Optional)" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "https://example.com/avatar.jpg" }, field, { disabled: createRoomMutation.isPending })) }), _jsx(FormDescription, { children: "Provide a URL for the room's avatar image." }), _jsx(FormMessage, {})] })) }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleClose, disabled: createRoomMutation.isPending, children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createRoomMutation.isPending, children: createRoomMutation.isPending ? 'Creating...' : 'Create Room' })] })] }) }))] }) }));
}
