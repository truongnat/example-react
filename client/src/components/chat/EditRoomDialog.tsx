import { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUpdateRoom } from '@/hooks/useChat';
import { RoomData } from '@/services/socket.service';

interface EditRoomDialogProps {
  room: RoomData;
  trigger?: React.ReactNode;
}

export function EditRoomDialog({ room, trigger }: EditRoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: room.name,
    avatarUrl: room.avatarUrl || '',
  });

  const updateRoomMutation = useUpdateRoom(room.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateRoomMutation.mutateAsync({
        name: formData.name.trim(),
        avatarUrl: formData.avatarUrl.trim() || undefined,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update room:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.name.trim().length > 0;
  const hasChanges = formData.name !== room.name || formData.avatarUrl !== (room.avatarUrl || '');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="justify-start">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Room Info
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Room Information
          </DialogTitle>
          <DialogDescription>
            Update the room name and avatar URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter room name"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.name.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar-url">Avatar URL (optional)</Label>
            <Input
              id="avatar-url"
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-gray-500">
              Provide a URL for the room's avatar image
            </p>
          </div>

          {/* Preview */}
          {formData.avatarUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={formData.avatarUrl}
                  alt="Room avatar preview"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm text-gray-500">Room preview</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={updateRoomMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || !hasChanges || updateRoomMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateRoomMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
