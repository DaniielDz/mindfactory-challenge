/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from './RegisterPage';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/auth';

vi.mock('../services/auth', () => ({ authService: { register: vi.fn() } }));
const mockLoginFn = vi.fn();
vi.mock('../hooks/useAuth', () => ({ useAuth: () => ({ login: mockLoginFn }) }));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe renderizar el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validación si se envía vacío', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/El nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/correo inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña debe tener/i)).toBeInTheDocument();
    });
  });

  it('debe registrar usuario y redirigir al éxito', async () => {
    const user = userEvent.setup();
    (authService.register as any).mockResolvedValue({ id: '1', email: 'new@test.com' });

    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Nuevo User');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'new@test.com');
    await user.type(screen.getByLabelText(/^contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Nuevo User',
        email: 'new@test.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('debe manejar errores del servidor (ej: email duplicado)', async () => {
    const user = userEvent.setup();
    const errorResponse = { response: { data: { message: 'El email ya está en uso' } } };
    (authService.register as any).mockRejectedValue(errorResponse);

    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByLabelText(/nombre completo/i), 'User Duplicate');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'duplicate@test.com');
    await user.type(screen.getByLabelText(/^contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLoginFn).not.toHaveBeenCalled();
    });
  });
});