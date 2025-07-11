import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { SocketService } from '@infrastructure/external-services/SocketService';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class RemoveMemberUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly userRepository: IUserRepository,
    private readonly socketService: SocketService
  ) {}

  async execute(roomId: UUID, memberIdToRemove: UUID, requesterId: UUID): Promise<void> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if requester is the room author
    if (!room.isAuthor(requesterId)) {
      throw new ForbiddenException('Only room author can remove members');
    }

    // Check if member to remove exists in the room
    if (!room.isParticipant(memberIdToRemove)) {
      throw new NotFoundException('User is not a member of this room');
    }

    // Don't allow removing the room author
    if (room.isAuthor(memberIdToRemove)) {
      throw new ForbiddenException('Cannot remove room author');
    }

    // Don't allow removing yourself (use leave room instead)
    if (requesterId === memberIdToRemove) {
      throw new ForbiddenException('Use leave room to remove yourself');
    }

    // Get user info for notification
    const removedUser = await this.userRepository.findById(memberIdToRemove);
    if (!removedUser) {
      throw new NotFoundException('User to remove not found');
    }

    // Remove member from room
    room.removeParticipant(memberIdToRemove);

    // Save updated room
    await this.roomRepository.update(room);

    // Broadcast member removal to the removed user (redirect them)
    this.socketService.notifyUserRemovedFromRoom({
      userId: memberIdToRemove,
      username: removedUser.username,
      roomId: room.id,
      roomName: room.name,
    });

    // Broadcast to remaining room members that user was removed
    this.socketService.broadcastMemberRemoved({
      roomId: room.id,
      roomName: room.name,
      removedUserId: memberIdToRemove,
      removedUsername: removedUser.username,
      remainingParticipants: room.participants,
    });
  }
}
