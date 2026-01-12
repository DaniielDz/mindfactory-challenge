import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginForm } from '../schemas/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';
import { getErrorMessage } from '../utils/api-error';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const { user } = await authService.login(data);
      login(user);
      toast.success(`¡Bienvenido de nuevo, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error al iniciar sesión'));
    }
  };

  return (
    <AuthLayout
      title="Inicia sesión"
      icon={LogIn}
      subtitle={
        <>
          O{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            crea una cuenta nueva
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Correo electrónico"
          type="email"
          registration={register('email')}
          error={errors.email}
        />

        <InputField
          label="Contraseña"
          type="password"
          registration={register('password')}
          error={errors.password}
        />

        <div>
          <Button type="submit" isLoading={isSubmitting}>
            Entrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};
