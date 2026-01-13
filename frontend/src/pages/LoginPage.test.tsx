/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/auth';

vi.mock('../services/auth', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const mockLoginFn = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLoginFn,
  }),
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
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validación si se envía vacío', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /entrar/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/correo inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('debe llamar al servicio de login y redirigir al éxito', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', name: 'Test User', email: 'test@test.com' };

    (authService.login as any).mockResolvedValue({ user: mockUser });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(mockLoginFn).toHaveBeenCalledWith(mockUser);

      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('debe manejar errores del servidor', async () => {
    const user = userEvent.setup();
    const error = { response: { data: { message: 'Credenciales inválidas' } } };
    (authService.login as any).mockRejectedValue(error);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/correo electrónico/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLoginFn).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});