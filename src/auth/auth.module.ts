import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 't%z&v1qoy46LTHMxU6@5E1ra*20VKtWX',
    }),
    UsersModule,
    PrismaModule,
  ],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
