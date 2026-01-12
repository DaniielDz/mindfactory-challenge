import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import type { Post } from '../types/post';
import { postsService } from '../services/posts';
import { CreatePostForm } from '../components/posts/CreatePostForm';
import { PostCard } from '../components/posts/PostCard';
import { EditPostModal } from '../components/posts/EditPostModal';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { isAuthenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      const data = await postsService.getAll();
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
      {!isAuthenticated && (
        <div className="text-center py-6 px-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            ¡Bienvenido a MindFactory Feed!
          </h2>
          <p className="text-blue-700">
            Inicia sesión o regístrate para crear publicaciones.
          </p>
        </div>
      )}

      {isAuthenticated && <CreatePostForm onPostCreated={fetchPosts} />}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Aún no hay publicaciones. ¡Sé el primero!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={(p) => setEditingPost(p)}
            />
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
