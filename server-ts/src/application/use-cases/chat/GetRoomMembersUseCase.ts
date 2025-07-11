import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { GetRoomMembersResponseDto, RoomMemberDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class GetRoomMembersUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(roomId: UUID, requesterId: UUID): Promise<GetRoomMembersResponseDto> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if requester can access this room
    if (!room.canUserAccess(requesterId)) {
      throw new ForbiddenException('Access denied to this room');
    }

    // Get all participants' user details
    const participantIds = room.participants;
    const users = await this.userRepository.findByIds(participantIds);

    // Map users to room members with additional info
    const members: RoomMemberDto[] = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      isAuthor: user.id === room.authorId,
      joinedAt: user.id === room.authorId ? room.createdAt : room.updatedAt, // Approximate join date
    }));

    // Sort members: author first, then by username
    members.sort((a, b) => {
      if (a.isAuthor && !b.isAuthor) return -1;
      if (!a.isAuthor && b.isAuthor) return 1;
      return a.username.localeCompare(b.username);
    });

    return {
      members,
      totalMembers: members.length,
      roomInfo: {
        id: room.id,
        name: room.name,
        authorId: room.authorId,
        createdAt: room.createdAt,
      },
    };
  }
}
