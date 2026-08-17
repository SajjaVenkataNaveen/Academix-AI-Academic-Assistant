import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}