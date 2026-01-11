import { Calendar, Mail, User } from 'lucide-react';
import type { User as UserType } from '../../types/auth';

interface Props {
  profile: UserType;
}

export const ProfileHeader = ({ profile }: Props) => {
  return (
    <>
      <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>

      <div className="px-8 pb-4">
        <div className="relative -mt-12 mb-4">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white p-1 shadow-md">
            <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User className="h-12 w-12" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-gray-500">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {profile.email}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Miembro desde{' '}
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
