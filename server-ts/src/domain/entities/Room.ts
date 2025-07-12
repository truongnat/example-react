import { BaseEntity, UUID } from '@shared/types/common.types';

export interface RoomProps {
  id: UUID;
  name: string;
  avatarUrl: string;
  authorId: UUID;
  lastMessageId?: UUID;
  participants: UUID[];
  createdAt: Date;
  updatedAt: Date;
}

export class Room implements BaseEntity {
  private constructor(private props: RoomProps) {}

  public static create(props: Omit<RoomProps, 'id' | 'createdAt' | 'updatedAt' | 'participants' | 'avatarUrl'> & { avatarUrl?: string }): Room {
    const now = new Date();
    return new Room({
      ...props,
      id: crypto.randomUUID(),
      avatarUrl: props.avatarUrl || '',
      participants: [props.authorId], // Author is automatically a participant
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(props: RoomProps): Room {
    return new Room(props);
  }

  // Getters
  get id(): UUID {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get avatarUrl(): string {
    return this.props.avatarUrl;
  }

  get authorId(): UUID {
    return this.props.authorId;
  }

  get lastMessageId(): UUID | undefined {
    return this.props.lastMessageId;
  }

  get participants(): UUID[] {
    return [...this.props.participants]; // Return copy to prevent mutation
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updateInfo(name?: string, avatarUrl?: string): void {
    let hasChanges = false;

    if (name !== undefined) {
      this.props.name = name;
      hasChanges = true;
    }
    if (avatarUrl !== undefined) {
      this.props.avatarUrl = avatarUrl;
      hasChanges = true;
    }

    if (hasChanges) {
      this.props.updatedAt = new Date();
    }
  }

  public addParticipant(userId: UUID): void {
    if (!this.props.participants.includes(userId)) {
      this.props.participants.push(userId);
      this.props.updatedAt = new Date();
    }
  }

  public removeParticipant(userId: UUID): void {
    if (userId === this.props.authorId) {
      throw new Error('Cannot remove room author from participants');
    }
    
    const index = this.props.participants.indexOf(userId);
    if (index > -1) {
      this.props.participants.splice(index, 1);
      this.props.updatedAt = new Date();
    }
  }

  public setLastMessage(messageId: UUID): void {
    this.props.lastMessageId = messageId;
    this.props.updatedAt = new Date();
  }

  public isParticipant(userId: UUID): boolean {
    return this.props.participants.includes(userId);
  }

  public isAuthor(userId: UUID): boolean {
    return this.props.authorId === userId;
  }

  public canUserAccess(userId: UUID): boolean {
    return this.isParticipant(userId);
  }

  public canUserModify(userId: UUID): boolean {
    return this.isAuthor(userId);
  }

  public getParticipantCount(): number {
    return this.props.participants.length;
  }

  public toJSON(): RoomProps {
    return { ...this.props };
  }
}
