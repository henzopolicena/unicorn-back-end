import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<CreateUserDto> {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.users.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!(await this.findOne(id))) {
      throw new NotFoundException(`User not found`);
    }
    const salt = await bcrypt.genSalt();
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    if (!(await this.findOne(id))) {
      throw new NotFoundException(`User not found`);
    }

    return this.prisma.users.delete({
      where: { id },
    });
  }
}
