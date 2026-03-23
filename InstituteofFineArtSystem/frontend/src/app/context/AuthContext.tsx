import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi, type AuthResponse } from '../api/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateProfile: (data: {
    fullName: string;
    email: string;
    phone: string;
    newPassword?: string;
    currentPassword?: string;
  }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(r: AuthResponse): User {
  return {
    id: r.id,
    username: r.username,
    passwordHash: '',
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    isActive: true,
    roleId: 0,
    role: r.role as User['role'],
    createdAt: new Date().toISOString(),
    avatarUrl: r.avatarUrl,
    // store token on the object so client.ts can read it
    token: r.token,
  } as User & { token: string };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const persist = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.login(username, password);
      persist(toUser(res));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!currentUser) return;
    const res = await authApi.updateProfile({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      avatarUrl,
    });
    persist(toUser(res));
  };

  const updateProfile = async (data: {
    fullName: string;
    email: string;
    phone: string;
    newPassword?: string;
    currentPassword?: string;
  }) => {
    const res = await authApi.updateProfile({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    persist(toUser(res));
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, updateAvatar, updateProfile, isAuthenticated: !!currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
