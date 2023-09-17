import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  createToken(user: { username: string; id?: number; email: string }) {
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

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    } else if (!(await bcrypt.compare(password, user.password))) {
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

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '1h',
        subject: 'forget-password',
        issuer: 'auth/forget-password',
        audience: 'users',
      },
    );

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de senha',
      text: 'Recuperação de senha',
      template: 'forget',
      context: {
        username: user.username,
        token,
      },
    });

    return { message: 'E-mail enviado com sucesso.' };
  }

  async resetPassword(token: string, password: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: 'auth/forget-password',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token inválido.');
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      const user = await this.prisma.users.update({
        where: {
          id: Number(data.id),
        },
        data: {
          password,
        },
      });
      const tokenData = this.createToken(user);
      return tokenData;
    } catch (e) {
      throw new BadRequestException('Token inválido.');
    }
  }

  async signUp(data: SignUpAuthDto) {
    const user = await this.usersService.create(data);
    return this.createToken(user);
  }
}
