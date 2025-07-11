var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return (React.createElement(Dialog, { open: open, onOpenChange: handleClose },
        React.createElement(DialogContent, { className: "sm:max-w-[425px]" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null, "Create New Room"),
                React.createElement(DialogDescription, null, "Create a new chat room to start conversations with your team.")),
            React.createElement(Form, Object.assign({}, form),
                React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4" },
                    React.createElement(FormField, { control: form.control, name: "name", render: ({ field }) => (React.createElement(FormItem, null,
                            React.createElement(FormLabel, null, "Room Name"),
                            React.createElement(FormControl, null,
                                React.createElement(Input, Object.assign({ placeholder: "Enter room name..." }, field, { disabled: createRoomMutation.isPending }))),
                            React.createElement(FormDescription, null, "Choose a descriptive name for your room."),
                            React.createElement(FormMessage, null))) }),
                    React.createElement(FormField, { control: form.control, name: "avatarUrl", render: ({ field }) => (React.createElement(FormItem, null,
                            React.createElement(FormLabel, null, "Avatar URL (Optional)"),
                            React.createElement(FormControl, null,
                                React.createElement(Input, Object.assign({ placeholder: "https://example.com/avatar.jpg" }, field, { disabled: createRoomMutation.isPending }))),
                            React.createElement(FormDescription, null, "Provide a URL for the room's avatar image."),
                            React.createElement(FormMessage, null))) }),
                    React.createElement(DialogFooter, null,
                        React.createElement(Button, { type: "button", variant: "outline", onClick: handleClose, disabled: createRoomMutation.isPending }, "Cancel"),
                        React.createElement(Button, { type: "submit", disabled: createRoomMutation.isPending }, createRoomMutation.isPending ? 'Creating...' : 'Create Room')))))));
}
