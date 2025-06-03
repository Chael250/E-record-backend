import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyDto: { email: string; otp: string }) {
    return this.authService.verifyEmail(verifyDto.email, verifyDto.otp);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: { email: string }) {
    return this.authService.forgotPassword(forgotDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(resetDto.email, resetDto.otp, resetDto.newPassword);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendDto: { email: string; type: 'email_verification' | 'password_reset' }) {
    return this.authService.resendOTP(resendDto.email, resendDto.type);
  }
}