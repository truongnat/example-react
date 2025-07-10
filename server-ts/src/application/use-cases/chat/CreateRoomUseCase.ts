import { Room } from '@domain/entities/Room';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { CreateRoomRequestDto, CreateRoomResponseDto } from '@application/dtos/chat.dto';
import { ValidationException, ConflictException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export class CreateRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(request: CreateRoomRequestDto, authorId: UUID): Promise<CreateRoomResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Check if room with same name already exists
    const existingRoom = await this.roomRepository.existsByName(request.name);
    if (existingRoom) {
      throw new ConflictException('Room with this name already exists');
    }

    // Create room
    const room = Room.create({
      name: request.name,
      avatarUrl: request.avatarUrl || '',
      authorId,
    });

    // Save room
    const savedRoom = await this.roomRepository.create(room);

    return {
      room: savedRoom.toJSON(),
    };
  }

  private validateRequest(request: CreateRoomRequestDto): void {
    const errors: string[] = [];

    if (!request.name || request.name.trim().length === 0) {
      errors.push('Room name is required');
    } else if (request.name.trim().length > 100) {
      errors.push('Room name must be less than 100 characters');
    }

    if (request.avatarUrl && request.avatarUrl.length > 500) {
      errors.push('Avatar URL must be less than 500 characters');
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
