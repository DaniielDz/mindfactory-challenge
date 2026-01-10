import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('mindfactory_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user from storage', error);
        localStorage.removeItem('mindfactory_user');
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mindfactory_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindfactory_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
