import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoomDialog({ open, onOpenChange }: CreateRoomDialogProps) {
  const createRoomMutation = useCreateRoom();

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      avatarUrl: '',
    },
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      await createRoomMutation.mutateAsync({
        name: data.name,
        avatarUrl: data.avatarUrl || undefined,
      });
      
      // Close dialog and reset form
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to create room:', error);
    }
  };

  const handleClose = () => {
    if (!createRoomMutation.isPending) {
      onOpenChange(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a new chat room to start conversations with your team.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room name..."
                      {...field}
                      disabled={createRoomMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your room.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      {...field}
                      disabled={createRoomMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the room's avatar image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRoomMutation.isPending}
              >
                {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
