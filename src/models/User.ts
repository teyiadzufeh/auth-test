import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { User } from '../generated/prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export class UserModel {
  async create(data: CreateUserData): Promise<Omit<User, 'password'>> {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Exclude password
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return comparePassword(plainPassword, hashedPassword);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}