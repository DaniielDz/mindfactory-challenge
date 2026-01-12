import api from '../lib/axios';
import type { User } from '../types/auth';
import type { UpdateUserData } from '../schemas/user';

export const usersService = {
  getOne: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  update: async (id: string, data: UpdateUserData) => {
    const payload = { ...data };
    if (!payload.password) delete payload.password;

    const { data: updatedUser } = await api.put<User>(`/users/${id}`, payload);
    return updatedUser;
  },
};
