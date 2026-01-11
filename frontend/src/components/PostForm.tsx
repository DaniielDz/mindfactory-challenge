import { Save, Send } from 'lucide-react';
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import type { CreatePostData, UpdatePostData } from '../types/post';

interface Props {
  register: UseFormRegister<CreatePostData | UpdatePostData>;
  handleSubmit: UseFormHandleSubmit<CreatePostData | UpdatePostData>;
  onSubmit: (data: CreatePostData | UpdatePostData) => Promise<void>;
  errors: FieldErrors<CreatePostData | UpdatePostData>;
  isSubmitting: boolean;
  buttonLabel?: string;
}

export const PostForm = ({
  register,
  errors,
  handleSubmit,
  isSubmitting,
  onSubmit,
  buttonLabel,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('title')}
          placeholder="Título de tu publicación"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('content')}
          placeholder="¿Qué estás pensando?"
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            'Guardando...'
          ) : (
            <>
              {buttonLabel === 'Publicar' ? (
                <Send className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {buttonLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
