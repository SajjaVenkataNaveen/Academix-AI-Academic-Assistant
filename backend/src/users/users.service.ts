import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  },
});
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
}

  async createUser(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    await this.getUser(id);
    if (data.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: data.email, id: { not: id } },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    const updateData = data.password
      ? { ...data, password: await bcrypt.hash(data.password, 10) }
      : data;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async deleteUser(id: string) {
  await this.getUser(id);
  return this.prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
}
