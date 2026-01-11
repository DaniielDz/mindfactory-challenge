import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import api from '../lib/axios';
import { useAuth } from '../hooks/useAuth';
import type { User as UserType } from '../types/auth';

import { ProfileHeader } from '../components/profile/ProfileHeader';
import { EditProfileForm } from '../components/profile/EditProfileForm';
import { ProfilePosts } from '../components/profile/ProfilePosts';

export const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const isCurrentUserProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile)
    return <div className="text-center py-10">Usuario no encontrado</div>;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ProfileHeader profile={profile} />

        {isCurrentUserProfile && !isEditing && (
          <div className="px-8 pb-6 border-b border-gray-100">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Pencil className="h-4 w-4" />
              Editar Perfil
            </button>
          </div>
        )}

        {isEditing && (
          <EditProfileForm
            user={profile}
            onCancel={() => setIsEditing(false)}
            onSuccess={(updatedUser) => {
              setProfile(updatedUser);
              setIsEditing(false);
            }}
          />
        )}
      </div>

      <ProfilePosts userId={profile.id} userName={profile.name} />
    </div>
  );
};
