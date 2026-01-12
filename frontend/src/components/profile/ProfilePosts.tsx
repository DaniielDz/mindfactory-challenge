import { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import type { Post } from '../../types/post';
import { PostCard } from '../posts/PostCard';
import { postsService } from '../../services/posts';

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
        const data = await postsService.getAll();
        const userPosts = data.filter((post) => post.user_id === userId);
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
            {userName} aún no ha creado ninguna publicación.
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
