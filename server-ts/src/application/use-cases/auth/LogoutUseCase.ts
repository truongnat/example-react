import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { SocketService } from '@infrastructure/external-services/SocketService';
import { UUID } from '@shared/types/common.types';
import { NotFoundException } from '@shared/exceptions';

export class LogoutUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly socketService: SocketService
  ) {}

  async execute(userId: UUID): Promise<void> {
    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user online status to offline
    user.setOnlineStatus(false);
    await this.userRepository.update(user);

    // Get all rooms where user is a participant
    const userRooms = await this.roomRepository.findByParticipant(userId, { page: 1, limit: 1000 });

    // Broadcast user offline status to all rooms the user is part of
    for (const room of userRooms.data) {
      this.socketService.broadcastUserOfflineToRoom({
        userId: user.id,
        username: user.username,
        roomId: room.id,
      });
    }

    // Disconnect user's socket connections
    this.socketService.disconnectUser(userId);
  }
}
