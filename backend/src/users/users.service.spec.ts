import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

const mockUser = {
  id: 'uuid',
  name: 'Test User',
  email: 'test@test.com',
  password: 'oldHash',
  created_at: new Date(),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('uuid');
      expect(result).toEqual(mockUser);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user without password', async () => {
      const updateDto = { name: 'Updated Name' };
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update('uuid', updateDto);

      expect(result.name).toBe('Updated Name');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        data: updateDto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        select: expect.any(Object),
      });
    });

    it('should hash password if included in update', async () => {
      const updateDto = { password: 'newPassword' };
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: 'hashedPassword123',
      });

      await service.update('uuid', updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        data: { password: 'hashedPassword123' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        select: expect.any(Object),
      });
    });
  });
});
