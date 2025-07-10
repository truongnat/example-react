import { EmailOptions } from '@shared/types/common.types';

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<void>;
  sendOTPEmail(to: string, otp: string, username: string): Promise<void>;
  sendPasswordResetEmail(to: string, newPassword: string, username: string): Promise<void>;
}
