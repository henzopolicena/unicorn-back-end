import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createToken(user: { username: string; id?: number; email: string }) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: 'user',
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
        issuer: 'auth/login',
        audience: 'users',
      }),
    };
  }

  async checkToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'auth/login',
        audience: 'users',
      });
    } catch (e) {
      throw new BadRequestException('Token inválido.');
    }
  }

  async login(username: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        username,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    }

    return this.createToken(user);
  }

  async forgetPassword(username: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail inválido.');
    }
    //TO DO: Enviar o e-mail...
    return true;
  }

  async resetPassword(token: string, password: string) {
    const id = 0;
    const user = await this.prisma.users.update({
      where: {
        id: id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async signUp(data: SignUpAuthDto) {
    const user = await this.usersService.create(data);
    return this.createToken(user);
  }
}
