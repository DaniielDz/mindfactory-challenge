/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth';
import api from '../lib/axios';

vi.mock('../lib/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login should call api.post with correct parameters', async () => {
    const mockData = { email: 'test@test.com', password: '123' };
    const mockResponse = { data: { user: { id: '1', name: 'User' } } };

    (api.post as any).mockResolvedValue(mockResponse);

    const result = await authService.login(mockData);

    expect(api.post).toHaveBeenCalledWith('/auth/login', mockData);
    expect(result).toEqual(mockResponse.data);
  });

  it('register should call api.post with correct parameters', async () => {
    const mockData = { name: 'User', email: 'test@test.com', password: '123' };
    const mockResponse = { data: { id: '1', email: 'test@test.com' } };

    (api.post as any).mockResolvedValue(mockResponse);

    const result = await authService.register(mockData);

    expect(api.post).toHaveBeenCalledWith('/auth/register', mockData);
    expect(result).toEqual(mockResponse.data);
  });
});
