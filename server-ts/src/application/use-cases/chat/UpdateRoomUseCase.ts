import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { UpdateRoomRequestDto, UpdateRoomResponseDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException, ValidationException, ConflictException } from '@shared/exceptions';

export class UpdateRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(roomId: UUID, request: UpdateRoomRequestDto, userId: UUID): Promise<UpdateRoomResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user can modify this room
    if (!room.canUserModify(userId)) {
      throw new ForbiddenException('Only room author can modify the room');
    }

    // Check if new name conflicts with existing room (if name is being changed)
    if (request.name && request.name !== room.name) {
      const existingRoom = await this.roomRepository.existsByName(request.name);
      if (existingRoom) {
        throw new ConflictException('Room with this name already exists');
      }
    }

    // Update room
    room.updateInfo(request.name, request.avatarUrl);

    // Save updated room
    const updatedRoom = await this.roomRepository.update(room);

    return {
      room: updatedRoom.toJSON(),
    };
  }

  private validateRequest(request: UpdateRoomRequestDto): void {
    if (request.name !== undefined) {
      if (typeof request.name !== 'string' || request.name.trim().length === 0) {
        throw new ValidationException('Room name cannot be empty');
      }

      if (request.name.length > 100) {
        throw new ValidationException('Room name cannot exceed 100 characters');
      }
    }

    if (request.avatarUrl !== undefined && request.avatarUrl !== '') {
      // Basic URL validation
      try {
        new URL(request.avatarUrl);
      } catch {
        throw new ValidationException('Invalid avatar URL');
      }
    }
  }
}
