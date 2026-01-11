import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';
import { type UpdateUserData, updateUserSchema } from '../../schemas/user';
import type { User as UserType } from '../../types/auth';

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
    const payload = { ...data };
    if (!payload.password) delete payload.password;

    try {
      const res = await api.put(`/users/${user.id}`, payload);
      const updatedUser = res.data;

      toast.success('Perfil actualizado correctamente');

      login(updatedUser);

      onSuccess(updatedUser);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al actualizar perfil';
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña{' '}
            <span className="text-gray-400 font-normal">(Opcional)</span>
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="Deja vacío para mantener la actual"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <X className="h-4 w-4" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                <Save className="h-4 w-4" /> Guardar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
