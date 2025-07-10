import { BaseEntity, UUID } from '@shared/types/common.types';

export interface MessageProps {
  id: UUID;
  content: string;
  authorId: UUID;
  roomId: UUID;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Message implements BaseEntity {
  private constructor(private props: MessageProps) {}

  public static create(props: Omit<MessageProps, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Message {
    const now = new Date();
    return new Message({
      ...props,
      id: crypto.randomUUID(),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(props: MessageProps): Message {
    return new Message(props);
  }

  // Getters
  get id(): UUID {
    return this.props.id;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): UUID {
    return this.props.authorId;
  }

  get roomId(): UUID {
    return this.props.roomId;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updateContent(content: string): void {
    if (this.props.isDeleted) {
      throw new Error('Cannot update deleted message');
    }
    this.props.content = content;
    this.props.updatedAt = new Date();
  }

  public delete(): void {
    this.props.isDeleted = true;
    this.props.updatedAt = new Date();
  }

  public restore(): void {
    this.props.isDeleted = false;
    this.props.updatedAt = new Date();
  }

  public isAuthor(userId: UUID): boolean {
    return this.props.authorId === userId;
  }

  public canBeEditedBy(userId: UUID): boolean {
    return this.isAuthor(userId) && !this.props.isDeleted;
  }

  public canBeDeletedBy(userId: UUID): boolean {
    return this.isAuthor(userId) && !this.props.isDeleted;
  }

  public isVisible(): boolean {
    return !this.props.isDeleted;
  }

  public belongsToRoom(roomId: UUID): boolean {
    return this.props.roomId === roomId;
  }

  public toJSON(): MessageProps {
    return { ...this.props };
  }

  public toPublicJSON(): Omit<MessageProps, 'isDeleted'> {
    const { isDeleted, ...publicProps } = this.props;
    return publicProps;
  }
}
