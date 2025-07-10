import { BaseEntity, UUID } from '@shared/types/common.types';
import { TodoStatus, TODO_STATUS } from '@shared/constants';

export interface TodoProps {
  id: UUID;
  title: string;
  content: string;
  status: TodoStatus;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo implements BaseEntity {
  private constructor(private props: TodoProps) {}

  public static create(props: Omit<TodoProps, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Todo {
    const now = new Date();
    return new Todo({
      ...props,
      id: crypto.randomUUID(),
      status: TODO_STATUS.INITIAL,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(props: TodoProps): Todo {
    return new Todo(props);
  }

  // Getters
  get id(): UUID {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get status(): TodoStatus {
    return this.props.status;
  }

  get userId(): UUID {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updateContent(title?: string, content?: string): void {
    if (title !== undefined) {
      this.props.title = title;
    }
    if (content !== undefined) {
      this.props.content = content;
    }
    this.props.updatedAt = new Date();
  }

  public changeStatus(status: TodoStatus): void {
    this.validateStatusTransition(this.props.status, status);
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public markAsTodo(): void {
    this.changeStatus(TODO_STATUS.TODO);
  }

  public markAsReview(): void {
    this.changeStatus(TODO_STATUS.REVIEW);
  }

  public markAsDone(): void {
    this.changeStatus(TODO_STATUS.DONE);
  }

  public markAsKeeping(): void {
    this.changeStatus(TODO_STATUS.KEEPING);
  }

  public isOwnedBy(userId: UUID): boolean {
    return this.props.userId === userId;
  }

  public isDone(): boolean {
    return this.props.status === TODO_STATUS.DONE;
  }

  public isInProgress(): boolean {
    return this.props.status === TODO_STATUS.TODO || this.props.status === TODO_STATUS.REVIEW;
  }

  private validateStatusTransition(currentStatus: TodoStatus, newStatus: TodoStatus): void {
    // Define valid transitions
    const validTransitions: Record<TodoStatus, TodoStatus[]> = {
      [TODO_STATUS.INITIAL]: [TODO_STATUS.TODO, TODO_STATUS.KEEPING],
      [TODO_STATUS.TODO]: [TODO_STATUS.REVIEW, TODO_STATUS.DONE, TODO_STATUS.KEEPING],
      [TODO_STATUS.REVIEW]: [TODO_STATUS.TODO, TODO_STATUS.DONE, TODO_STATUS.KEEPING],
      [TODO_STATUS.DONE]: [TODO_STATUS.KEEPING, TODO_STATUS.TODO],
      [TODO_STATUS.KEEPING]: [TODO_STATUS.TODO, TODO_STATUS.DONE],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }

  public toJSON(): TodoProps {
    return { ...this.props };
  }
}
