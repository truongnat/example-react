import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchUsers } from '@/hooks/useUsers';
import { useInviteUsers } from '@/hooks/useChat';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface InviteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  roomName: string;
}

export function InviteUsersDialog({
  open,
  onOpenChange,
  roomId,
  roomName,
}: InviteUsersDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: usersData, isLoading: isSearching } = useSearchUsers(
    debouncedSearchQuery,
    1,
    20,
    roomId
  );

  const inviteUsersMutation = useInviteUsers();

  const users = usersData?.users || [];

  // Backend already excludes room participants, so we just use the users directly

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleInvite = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      await inviteUsersMutation.mutateAsync({
        roomId,
        userIds: selectedUserIds,
      });

      // Reset state and close dialog
      setSelectedUserIds([]);
      setSearchQuery('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to invite users:', error);
    }
  };

  const handleClose = () => {
    setSelectedUserIds([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Users to {roomName}
          </DialogTitle>
          <DialogDescription>
            Search and select users to invite to this chat room.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Users Count */}
          {selectedUserIds.length > 0 && (
            <div className="text-sm text-gray-600">
              {selectedUserIds.length} user(s) selected
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            <Label>Available Users</Label>
            <div className="h-64 border rounded-md p-2 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Searching users...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No users found' : 'No users available'}
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        id={user.id}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleUserToggle(user.id, checked as boolean)
                        }
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> 
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedUserIds.length === 0 || inviteUsersMutation.isPending}
          >
            {inviteUsersMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Inviting...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite {selectedUserIds.length} User(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
