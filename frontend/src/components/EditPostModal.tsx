import { zodResolver } from '@hookform/resolvers/zod';
import { PostForm } from './PostForm';
import { useForm } from 'react-hook-form';
import { updatePostSchema } from '../schemas/posts';
import type { UpdatePostData, Post } from '../types/post';
import api from '../lib/axios';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface Props {
  post: Post;
  onPostUpdated: () => void;
  onClose: () => void;
}

export const EditPostModal = ({ post, onPostUpdated, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePostData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const onSubmit = async (data: UpdatePostData) => {
    try {
      await api.put(`/posts/${post.id}`, data);
      toast.success('¡Post actualizado!');
      onPostUpdated();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el post');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Editar publicación
        </h2>

        <PostForm
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          buttonLabel="Guardar cambios"
        />
      </div>
    </div>
  );
};
