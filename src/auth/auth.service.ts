import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { OtpToken } from './entities/otp-token.entity';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(OtpToken)
    private otpRepository: Repository<OtpToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(userData: any) {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate OTP and send email
    const otp = this.generateOTP();
    await this.saveOTP(user.email, otp, 'email_verification');
    await this.emailService.sendVerificationEmail(user.email, otp);

    const { password, ...userResponse } = user;
    return { 
      message: 'Registration successful. Please check your email for OTP verification.',
      user: userResponse 
    };
  }

  async verifyEmail(email: string, otp: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, type: 'email_verification', isUsed: false },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await this.otpRepository.save(otpRecord);

    // Verify user
    const user = await this.usersService.findByEmail(email);
    if(! user) throw new Error("No user")
    await this.usersService.updateVerificationStatus(user.id, true);

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const otp = this.generateOTP();
    await this.saveOTP(email, otp, 'password_reset');
    await this.emailService.sendPasswordResetEmail(email, otp);

    return { message: 'Password reset OTP sent to your email' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, type: 'password_reset', isUsed: false },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await this.otpRepository.save(otpRecord);

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.usersService.findByEmail(email);
    if(! user) throw new Error("No user")
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  async resendOTP(email: string, type: 'email_verification' | 'password_reset') {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    if (type === 'email_verification' && user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Invalidate existing OTPs
    await this.otpRepository.update(
      { email, type, isUsed: false },
      { isUsed: true }
    );

    const otp = this.generateOTP();
    await this.saveOTP(email, otp, type);

    if (type === 'email_verification') {
      await this.emailService.sendVerificationEmail(email, otp);
    } else {
      await this.emailService.sendPasswordResetEmail(email, otp);
    }

    return { message: `OTP resent successfully` };
  }

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async saveOTP(email: string, otp: string, type: 'email_verification' | 'password_reset') {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    const otpToken = this.otpRepository.create({
      email,
      otp,
      type,
      expiresAt,
    });

    await this.otpRepository.save(otpToken);
  }
}  