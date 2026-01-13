import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPost = {
  id: 'post-id',
  title: 'Post Title',
  content: 'Content',
  user_id: 'user-id',
  created_at: new Date(),
  user: { id: 'user-id', name: 'User', email: 'u@test.com' },
};

const mockPrismaService = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([mockPost]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockPost);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        orderBy: { created_at: 'desc' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        include: { user: expect.any(Object) },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post if found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findOne('post-id');
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const dto = { title: 'New', content: 'Content' };
      const userId = 'user-id';
      mockPrismaService.post.create.mockResolvedValue(mockPost);

      await service.create(dto, userId);

      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: { ...dto, user_id: userId },
      });
    });
  });

  describe('update', () => {
    it('should update and return the post', async () => {
      const dto = { title: 'Updated' };
      mockPrismaService.post.update.mockResolvedValue({ ...mockPost, ...dto });

      const result = await service.update('post-id', dto);

      expect(result.title).toBe('Updated');
      expect(mockPrismaService.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-id' },
          data: dto,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          include: expect.any(Object),
        }),
      );
    });
  });
});
