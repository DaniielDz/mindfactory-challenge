import api from '../lib/axios';
import type { CreatePostData, UpdatePostData, Post } from '../types/post';

export const postsService = {
  getAll: async () => {
    const { data } = await api.get<Post[]>('/posts');
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  },

  create: async (data: CreatePostData) => {
    const { data: newPost } = await api.post<Post>('/posts', data);
    return newPost;
  },

  update: async (id: string, data: UpdatePostData) => {
    const { data: updatedPost } = await api.put<Post>(`/posts/${id}`, data);
    return updatedPost;
  },
};
