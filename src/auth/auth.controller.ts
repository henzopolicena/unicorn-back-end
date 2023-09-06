import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { ForgetPasswordAuthDto } from './dto/forget-password.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() {username, password}: LoginAuthDto) {
    return this.authService.login(username, password);
  }

  @Post('sign-up')
  async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @Post('forget-password')
  async forgetPassword(@Body() { email }: ForgetPasswordAuthDto) {
    this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() {token, password}: ResetPasswordAuthDto) {
    this.authService.resetPassword(token, password);
  }
}
