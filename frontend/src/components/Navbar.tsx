import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Newspaper } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 flex items-center gap-2"
            >
              <Newspaper className="h-6 w-6" />
              MindFactory Feed
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                Hola, {user?.name}
              </span>

              <Link
                to={`/profile/${user?.id}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Mi Perfil"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
