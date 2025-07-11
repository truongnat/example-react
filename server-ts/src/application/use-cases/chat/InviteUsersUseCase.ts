import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException, ValidationException } from '@shared/exceptions';

export interface InviteUsersRequestDto {
  userIds: UUID[];
}

export interface InviteUsersResponseDto {
  invitedUsers: {
    id: UUID;
    username: string;
    email: string;
  }[];
  alreadyMembers: UUID[];
  notFound: UUID[];
}

export class InviteUsersUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    roomId: UUID, 
    request: InviteUsersRequestDto, 
    inviterId: UUID
  ): Promise<InviteUsersResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if inviter is room author
    if (!room.isAuthor(inviterId)) {
      throw new ForbiddenException('Only room author can invite users');
    }

    // Get users to invite
    const users = await this.userRepository.findByIds(request.userIds);
    const foundUserIds = users.map(user => user.id);
    const notFound = request.userIds.filter(id => !foundUserIds.includes(id));

    // Check which users are already members
    const alreadyMembers = foundUserIds.filter(userId => room.isParticipant(userId));
    const usersToInvite = users.filter(user => !room.isParticipant(user.id));

    // Add users to room
    for (const user of usersToInvite) {
      room.addParticipant(user.id);
      // Also add to repository for persistence
      await this.roomRepository.addParticipant(roomId, user.id);
    }

    // Update room if any users were added
    if (usersToInvite.length > 0) {
      await this.roomRepository.update(room);
    }

    return {
      invitedUsers: usersToInvite.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
      })),
      alreadyMembers,
      notFound,
    };
  }

  private validateRequest(request: InviteUsersRequestDto): void {
    if (!request.userIds || !Array.isArray(request.userIds)) {
      throw new ValidationException('userIds must be an array');
    }

    if (request.userIds.length === 0) {
      throw new ValidationException('At least one user ID must be provided');
    }

    if (request.userIds.length > 50) {
      throw new ValidationException('Cannot invite more than 50 users at once');
    }

    // Check for duplicates
    const uniqueIds = new Set(request.userIds);
    if (uniqueIds.size !== request.userIds.length) {
      throw new ValidationException('Duplicate user IDs are not allowed');
    }

    // Validate UUID format (basic check)
    for (const userId of request.userIds) {
      if (typeof userId !== 'string' || userId.length !== 36) {
        throw new ValidationException(`Invalid user ID format: ${userId}`);
      }
    }
  }
}
