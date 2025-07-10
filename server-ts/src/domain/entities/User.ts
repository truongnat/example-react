import { BaseEntity, UUID } from '@shared/types/common.types';
import { DEFAULT_AVATAR } from '@shared/constants';

export interface UserProps {
  id: UUID;
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
  isActive: boolean;
  isOnline: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements BaseEntity {
  private constructor(private props: UserProps) {}

  public static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isOnline'>): User {
    const now = new Date();
    return new User({
      ...props,
      id: crypto.randomUUID(),
      avatarUrl: props.avatarUrl || DEFAULT_AVATAR,
      isActive: true,
      isOnline: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): UUID {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get avatarUrl(): string {
    return this.props.avatarUrl || DEFAULT_AVATAR;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isOnline(): boolean {
    return this.props.isOnline;
  }

  get otp(): string | undefined {
    return this.props.otp;
  }

  get otpExpiresAt(): Date | undefined {
    return this.props.otpExpiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updateProfile(username?: string, avatarUrl?: string): void {
    if (username) {
      this.props.username = username;
    }
    if (avatarUrl) {
      this.props.avatarUrl = avatarUrl;
    }
    this.props.updatedAt = new Date();
  }

  public changePassword(newPassword: string): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  public setOnlineStatus(isOnline: boolean): void {
    this.props.isOnline = isOnline;
    this.props.updatedAt = new Date();
  }

  public setOTP(otp: string, expiresInSeconds: number = 120): void {
    this.props.otp = otp;
    this.props.otpExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    this.props.updatedAt = new Date();
  }

  public clearOTP(): void {
    delete this.props.otp;
    delete this.props.otpExpiresAt;
    this.props.updatedAt = new Date();
  }

  public isOTPValid(otp: string): boolean {
    if (!this.props.otp || !this.props.otpExpiresAt) {
      return false;
    }
    return this.props.otp === otp && this.props.otpExpiresAt > new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public toJSON(): UserProps {
    return { ...this.props };
  }

  public toPublicJSON(): Omit<UserProps, 'password' | 'otp' | 'otpExpiresAt'> {
    const { password, otp, otpExpiresAt, ...publicProps } = this.props;
    return publicProps;
  }
}
