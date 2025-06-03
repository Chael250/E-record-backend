import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpToken } from './entities/otp-token.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpToken, User])],  
  providers: [AuthService, UsersService, JwtService, EmailService],
  controllers: [AuthController]
})
export class AuthModule {}
