/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostDetailPage } from './PostDetailPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postsService } from '../services/posts';

vi.mock('../services/posts', () => ({
  postsService: {
    getOne: vi.fn(),
    update: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUser = { id: 'user-1', name: 'Yo Mismo', email: 'me@test.com' };
const mockPost = {
  id: 'post-1',
  title: 'Título Original',
  content: 'Contenido Original que cumple con la validación de longitud',
  user_id: 'user-1',
  created_at: new Date().toISOString(),
  user: mockUser,
};

let currentUser = mockUser;

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: currentUser }),
}));

describe('PostDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentUser = mockUser;
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/post/post-1']}>
        <Routes>
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('debe renderizar el post y mostrar botón editar si soy el dueño', async () => {
    (postsService.getOne as any).mockResolvedValue(mockPost);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Título Original')).toBeInTheDocument();
      expect(screen.getByText('Contenido Original que cumple con la validación de longitud')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
  });

  it('NO debe mostrar botón editar si NO soy el dueño', async () => {
    currentUser = { id: 'other-user', name: 'Otro', email: 'other@test.com' };
    (postsService.getOne as any).mockResolvedValue(mockPost);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Título Original')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
  });

  it('debe permitir editar y guardar los cambios', async () => {
    const user = userEvent.setup();
    (postsService.getOne as any).mockResolvedValue(mockPost);

    const updatedPost = { ...mockPost, title: 'Título Editado' };
    (postsService.update as any).mockResolvedValue(updatedPost);

    renderComponent();

    await screen.findByText('Título Original');

    await user.click(screen.getByRole('button', { name: /editar/i }));

    const titleInput = screen.getByLabelText(/título/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue('Título Original');

    await user.clear(titleInput);
    await user.type(titleInput, 'Título Editado');

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(postsService.update).toHaveBeenCalledWith('post-1', {
        title: 'Título Editado',
        content: 'Contenido Original que cumple con la validación de longitud',
      });

      expect(screen.getByText('Título Editado')).toBeInTheDocument();
      expect(screen.queryByLabelText(/título/i)).not.toBeInTheDocument();
    });
  });
});