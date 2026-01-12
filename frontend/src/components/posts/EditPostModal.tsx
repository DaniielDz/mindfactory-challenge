import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { PostForm } from './PostForm';
import type { Post, UpdatePostData } from '../../types/post';
import { updatePostSchema } from '../../schemas/posts';
import { postsService } from '../../services/posts';

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
      await postsService.update(post.id, data);
      toast.success('¡Post actualizado!');
      onPostUpdated();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el post');
    }
  };

  return (
    <div
      className="fixed px-5 lg:px-0 inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
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
