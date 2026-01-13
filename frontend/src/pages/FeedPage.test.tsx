/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { FeedPage } from './FeedPage';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postsService } from '../services/posts';

vi.mock('../services/posts', () => ({
  postsService: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

const mockUser = { id: '1', name: 'Test User', email: 'test@test.com' };
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children }: { children: any }) => <div>{children}</div>,
  };
});

describe('FeedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el esqueleto/loading inicialmente', () => {
    (postsService.getAll as any).mockImplementation(() => new Promise(() => { }));

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando publicaciones...')).toBeInTheDocument();
  });

  it('debe renderizar la lista de posts cuando la API responde', async () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'Primer Post',
        content: 'Contenido 1',
        user_id: '1',
        created_at: new Date().toISOString(),
        user: { id: '1', name: 'Juan Perez', email: 'juan@test.com' },
      },
      {
        id: 'p2',
        title: 'Segundo Post',
        content: 'Contenido 2',
        user_id: '2',
        created_at: new Date().toISOString(),
        user: { id: '2', name: 'Maria Gomez', email: 'maria@test.com' },
      },
    ];

    (postsService.getAll as any).mockResolvedValue(mockPosts);

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Primer Post')).toBeInTheDocument();
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();

      expect(screen.getByText('Segundo Post')).toBeInTheDocument();
      expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de vacío si no hay posts', async () => {
    (postsService.getAll as any).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Aún no hay publicaciones. ¡Sé el primero!/i)).toBeInTheDocument();
    });
  });
});