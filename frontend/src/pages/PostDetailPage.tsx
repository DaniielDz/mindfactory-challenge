import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, User, Edit2, Save, X } from 'lucide-react';
import { postsService } from '../services/posts';
import type { Post, UpdatePostData } from '../types/post';
import { updatePostSchema } from '../schemas/posts';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../components/ui/InputField';
import { TextAreaField } from '../components/ui/TextAreaField';
import { Button } from '../components/ui/Button';

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePostData>({
    resolver: zodResolver(updatePostSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await postsService.getOne(id);
        setPost(data);
        reset({
          title: data.title,
          content: data.content,
        });
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar la publicación');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, reset]);

  const onUpdate = async (data: UpdatePostData) => {
    if (!post) return;
    try {
      const updatedPost = await postsService.update(post.id, data);
      setPost(updatedPost);
      setIsEditing(false);
      toast.success('Publicación actualizada correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user?.id === post.user_id;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Feed
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          {isEditing ? (
            <div className="space-y-4">
              <InputField
                label="Título"
                registration={register('title')}
                error={errors.title}
              />
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 wrap-break-word">
                {post.title}
              </h1>

              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <Link
              to={`/profile/${post.user_id}`}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <User className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-700">
                {post.user.name}
              </span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isEditing ? (
            <div className="space-y-4">
              <TextAreaField
                label="Contenido"
                registration={register('content')}
                error={errors.content}
                rows={8}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    reset({ title: post.title, content: post.content });
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
                  type="button"
                >
                  <X className="h-4 w-4" /> Cancelar
                </button>

                <div className="w-auto">
                  <Button
                    onClick={handleSubmit(onUpdate)}
                    isLoading={isSubmitting}
                    processingLabel="Guardando..."
                  >
                    <Save className="h-4 w-4 mr-2" /> Guardar Cambios
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-none">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap wrap-break-word">
                {post.content}
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
