import nodemailer from 'nodemailer';
import { IEmailService } from '@application/interfaces/IEmailService';
import { EmailOptions } from '@shared/types/common.types';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: options.to,
        subject: options.subject,
        html: this.renderTemplate(options.template, options.context),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOTPEmail(to: string, otp: string, username: string): Promise<void> {
    const template = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset OTP</h2>
        <p>Hello ${username},</p>
        <p>You have requested to reset your password. Please use the following OTP code:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 2 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: 'Password Reset OTP',
      template,
      context: { otp, username },
    });
  }

  async sendPasswordResetEmail(to: string, newPassword: string, username: string): Promise<void> {
    const template = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Successful</h2>
        <p>Hello ${username},</p>
        <p>Your password has been successfully reset. Your new temporary password is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
          ${newPassword}
        </div>
        <p><strong>Important:</strong> Please log in and change this password immediately for security reasons.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: 'Password Reset Successful',
      template,
      context: { newPassword, username },
    });
  }

  private renderTemplate(template: string, context: Record<string, any>): string {
    // Simple template rendering - replace {{variable}} with context values
    let rendered = template;
    for (const [key, value] of Object.entries(context)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }
    return rendered;
  }
}
