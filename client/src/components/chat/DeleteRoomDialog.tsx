import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteRoom } from '@/hooks/useChat';
import { useNavigate } from '@tanstack/react-router';

interface DeleteRoomDialogProps {
  roomId: string;
  roomName: string;
  trigger?: React.ReactNode;
}

export function DeleteRoomDialog({ roomId, roomName, trigger }: DeleteRoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const navigate = useNavigate();
  
  const deleteRoomMutation = useDeleteRoom();

  const handleDelete = async () => {
    try {
      await deleteRoomMutation.mutateAsync(roomId);
      setIsOpen(false);
      // Navigate back to chat list
      navigate({ to: '/chat' });
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const isConfirmationValid = confirmationText === roomName;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Room
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Room
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete the room 
              <strong className="font-semibold"> "{roomName}"</strong> and remove all messages.
            </p>
            <p>
              All members will lose access to this room and its message history.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  Warning: This action is irreversible
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All messages will be permanently deleted</li>
                  <li>• All members will be removed from the room</li>
                  <li>• Room history cannot be recovered</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <strong>{roomName}</strong> to confirm deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${roomName}" here`}
              className="font-mono"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => {
              setConfirmationText('');
              setIsOpen(false);
            }}
            disabled={deleteRoomMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationValid || deleteRoomMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteRoomMutation.isPending ? 'Deleting...' : 'Delete Room'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
