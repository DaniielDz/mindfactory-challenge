import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
  icon: LucideIcon;
  iconColorClass?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  icon: Icon,
  iconColorClass = 'bg-blue-600',
}: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className={`${iconColorClass} p-3 rounded-xl shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};
