import { useState } from 'react';
import {
  Settings,
  Users,
  LogOut,
  Crown,
  UserMinus,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRoomMembers, useLeaveRoom, useRemoveMember } from '@/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';
import { RoomMember } from '@/services/chat.service';
import { useNavigate } from '@tanstack/react-router';
import { EditRoomDialog } from './EditRoomDialog';
import { DeleteRoomDialog } from './DeleteRoomDialog';

interface RoomSettingsProps {
  roomId: string;
  roomName: string;
  isAuthor: boolean;
  room?: any; // Room data for edit dialog
}

export function RoomSettings({ roomId, roomName, isAuthor, room }: RoomSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: membersData, isLoading, error } = useRoomMembers(roomId);
  const leaveRoomMutation = useLeaveRoom();
  const removeMemberMutation = useRemoveMember();

  const handleLeaveRoom = async () => {
    try {
      await leaveRoomMutation.mutateAsync(roomId);
      setShowLeaveDialog(false);
      setIsOpen(false);
      // Navigate back to chat list
      navigate({ to: '/chat' });
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOnlineStatus = (member: RoomMember) => {
    return member.isOnline ? 'Online' : 'Offline';
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from this room?`)) {
      try {
        await removeMemberMutation.mutateAsync({ roomId, memberId });
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(roomName);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    } catch (error) {
      console.error('Failed to copy room name:', error);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      console.error('Failed to copy room ID:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Room Settings
            </DialogTitle>
            <DialogDescription>
              Manage {roomName} settings and members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Room Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Room Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="flex-1">{membersData?.roomInfo.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopyName}
                        title="Copy room name"
                      >
                        {copiedName ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Created:</span>
                    <p className="mt-1">
                      {membersData?.roomInfo.createdAt && 
                        formatJoinDate(membersData.roomInfo.createdAt)
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Total Members:</span>
                    <p className="mt-1">{membersData?.totalMembers || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Online Members:</span>
                    <p className="mt-1 text-green-600">
                      {membersData?.members.filter(m => m.isOnline).length || 0}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Room ID:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="flex-1 font-mono text-xs text-gray-500 break-all">
                        {roomId}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={handleCopyId}
                        title="Copy room ID"
                      >
                        {copiedId ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Members List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members ({membersData?.totalMembers || 0})
                </h3>
              </div>

              {isLoading && (
                <div className="text-center py-8 text-gray-500">
                  Loading members...
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  Failed to load members
                </div>
              )}

              {membersData?.members && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {membersData.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>
                            {member.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.username}</span>
                            {member.isAuthor && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Owner
                              </Badge>
                            )}
                            {member.id === user?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span className={member.isOnline ? 'text-green-600' : 'text-gray-400'}>
                              {getOnlineStatus(member)}
                            </span>
                            <span>•</span>
                            <span>Joined {formatJoinDate(member.joinedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Member Actions - Only show for room author and not for themselves */}
                      {isAuthor && member.id !== user?.id && !member.isAuthor && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveMember(member.id, member.username)}
                            disabled={removeMemberMutation.isPending}
                            title={`Remove ${member.username} from room`}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Room Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              
              <div className="flex flex-col gap-2">
                {isAuthor && room && (
                  <>
                    <EditRoomDialog room={room} />
                    <DeleteRoomDialog roomId={roomId} roomName={roomName} />
                  </>
                )}
                
                {!isAuthor && (
                  <Button 
                    variant="outline" 
                    className="justify-start text-red-600 hover:text-red-700"
                    onClick={() => setShowLeaveDialog(true)}
                    disabled={leaveRoomMutation.isPending}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {leaveRoomMutation.isPending ? 'Leaving...' : 'Leave Room'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Room Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Leave Room
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{roomName}"? You won't be able to see new messages 
              unless someone invites you back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveRoom}
              className="bg-red-600 hover:bg-red-700"
              disabled={leaveRoomMutation.isPending}
            >
              {leaveRoomMutation.isPending ? 'Leaving...' : 'Leave Room'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
