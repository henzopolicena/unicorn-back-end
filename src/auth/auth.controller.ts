import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { ForgetPasswordAuthDto } from './dto/forget-password.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() { username, password }: LoginAuthDto) {
    return this.authService.login(username, password);
  }

  @Post('sign-up')
  async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @Post('forget-password')
  async forgetPassword(@Body() { username }: ForgetPasswordAuthDto) {
    return this.authService.forgetPassword(username);
  }

  @Post('reset-password')
  async resetPassword(@Body() { token, password }: ResetPasswordAuthDto) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@Req() req) {
    return { access_token: req.access_token, user: req.user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const result = await writeFile(
      join(__dirname, '..', '..', 'storage', 'photos', file.originalname),
      file.buffer,
    );
    return { access_token: req.access_token, user: req.user, photo: file };
  }
}
