import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { registerSchema, type RegisterForm } from '../schemas/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';
import { getErrorMessage } from '../utils/api-error';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authService.register(data);
      toast.success('Cuenta creada exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error al registrarse'));
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      icon={UserPlus}
      iconColorClass="bg-green-600"
      subtitle={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión aquí
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Nombre completo"
          registration={register('name')}
          error={errors.name}
        />

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
          <Button type="submit" variant="success" isLoading={isSubmitting}>
            Registrarse
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};
