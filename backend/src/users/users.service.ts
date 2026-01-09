import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id: ${id} no encontrado.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const dataToUpdate = { ...updateUserDto };

    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });

    return updatedUser;
  }
}
