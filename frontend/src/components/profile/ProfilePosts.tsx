import { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import api from '../../lib/axios';
import type { Post } from '../../types/post';
import { PostCard } from '../PostCard';

interface Props {
  userId: string;
  userName: string;
}

export const ProfilePosts = ({ userId, userName }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        const userPosts = data.filter((post: Post) => post.user_id === userId);
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchPosts();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando publicaciones...
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-0">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-blue-600" />
        Publicaciones de {userName}
      </h2>

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            Este usuario aún no ha publicado nada.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
