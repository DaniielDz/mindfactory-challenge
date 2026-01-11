import { useEffect, useState } from 'react';
import api from '../lib/axios';
import type { Post } from '../types/post';
import { CreatePostForm } from '../components/CreatePostForm';
import { MessageSquare, Calendar, Pencil } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { EditPostModal } from '../components/EditPostModal';
import { Link } from 'react-router-dom';

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { user, isAuthenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto relative">
      {isAuthenticated ? (
        <CreatePostForm onPostCreated={fetchPosts} />
      ) : (
        <div className="text-center py-6 px-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            ¡Bienvenido a MindFactory Feed!
          </h2>
          <p className="text-blue-700">
            Inicia sesión o regístrate para crear publicaciones.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Aún no hay publicaciones. ¡Sé el primero!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {post.user.name}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {user && user.id === post.user.id && (
                  <button
                    className="flex item-center group p-2 rounded-full bg-blue-50 hover:bg-blue-600 transition-colors cursor-pointer"
                    title="Editar Publicación"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingPost(post);
                    }}
                  >
                    <Pencil className="text-blue-600 w-4 h-4 group-hover:text-white transition-colors" />
                  </button>
                )}
              </div>

              <p className="text-gray-700 whitespace-pre-line leading-relaxed wrap-break-word">
                {post.content}
              </p>
            </Link>
          ))
        )}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onPostUpdated={() => {
            fetchPosts();
            setEditingPost(null);
          }}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};
