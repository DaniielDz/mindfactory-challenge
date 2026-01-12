import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { type UpdateUserData, updateUserSchema } from '../../schemas/user';
import type { User as UserType } from '../../types/auth';
import { usersService } from '../../services/users';
import { getErrorMessage } from '../../utils/api-error';
import { InputField } from '../ui/InputField';
import { Button } from '../ui/Button';

interface Props {
  user: UserType;
  onCancel: () => void;
  onSuccess: (updatedUser: UserType) => void;
}

export const EditProfileForm = ({ user, onCancel, onSuccess }: Props) => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
    },
  });

  const onUpdate = async (data: UpdateUserData) => {
    try {
      const updatedUser = await usersService.update(user.id, data);
      toast.success('Perfil actualizado correctamente');
      login(updatedUser);
      onSuccess(updatedUser);
    } catch (error) {
      console.error(error);
      const msg = getErrorMessage(error, 'Error al actualizar perfil');
      toast.error(msg);
    }
  };

  return (
    <div className="bg-gray-50 border-t border-b border-gray-100 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Editar Información
      </h3>

      <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Nombre Completo"
            registration={register('name')}
            error={errors.name}
          />

          <InputField
            label="Correo Electrónico"
            type="email"
            registration={register('email')}
            error={errors.email}
          />
        </div>

        <InputField
          label="Nueva Contraseña (Opcional)"
          type="password"
          placeholder="Deja vacío para mantener la actual"
          registration={register('password')}
          error={errors.password}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" /> Cancelar
          </button>

          <div className="w-auto">
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4 mr-2" /> Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
