import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../lib/axios';
import { toast } from 'sonner';
import { PostForm } from './PostForm';
import type { CreatePostData, UpdatePostData } from '../types/post';
import { createPostSchema } from '../schemas/posts';

interface Props {
  onPostCreated: () => void;
}

export const CreatePostForm = ({ onPostCreated }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data: CreatePostData | UpdatePostData) => {
    try {
      await api.post('/posts', data);
      toast.success('¡Post publicado!');
      reset();
      onPostCreated();
    } catch (error) {
      console.error(error);
      toast.error('Error al publicar el post');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Crear nueva publicación
      </h2>
      <PostForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </div>
  );
};
