import { Save, Send } from 'lucide-react';
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import type { CreatePostData, UpdatePostData } from '../../types/post';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { Button } from '../ui/Button';

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
      <InputField
        label="Título"
        placeholder="Título de tu publicación"
        registration={register('title')}
        error={errors.title}
      />

      <TextAreaField
        label="Contenido"
        placeholder="¿Qué estás pensando?"
        registration={register('content')}
        error={errors.content}
        rows={3}
      />

      <div className="flex justify-end">
        <div className="w-auto">
          <Button
            type="submit"
            isLoading={isSubmitting}
            processingLabel={
              buttonLabel === 'Publicar' ? 'Publicando...' : 'Guardando...'
            }
          >
            {buttonLabel === 'Publicar' ? (
              <Send className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {buttonLabel || 'Guardar'}
          </Button>
        </div>
      </div>
    </form>
  );
};
