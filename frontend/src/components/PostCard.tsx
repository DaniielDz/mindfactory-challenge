import { Link } from 'react-router-dom';
import {
  Calendar,
  MessageSquare,
  Pencil,
  User as UserIcon,
} from 'lucide-react';
import type { Post } from '../types/post';
import { useAuth } from '../hooks/useAuth';

interface Props {
  post: Post;
  onEdit?: (post: Post) => void;
}

export const PostCard = ({ post, onEdit }: Props) => {
  const { user } = useAuth();
  const isOwner = user?.id === post.user.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link to={`/post/${post.id}`} className="hover:underline">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {post.user.name}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {isOwner && onEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(post);
            }}
            className="p-2 rounded-full bg-gray-50 hover:bg-blue-600 group transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-gray-500 group-hover:text-white" />
          </button>
        )}
      </div>

      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-3">
        {post.content}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <Link
          to={`/post/${post.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" /> Leer completo
        </Link>
      </div>
    </div>
  );
};
