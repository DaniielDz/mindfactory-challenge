import api from '../lib/axios';
import type { LoginForm, RegisterForm } from '../schemas/auth';
import type { User } from '../types/auth';

export const authService = {
  login: async (data: LoginForm) => {
    const response = await api.post<{ user: User }>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterForm) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
