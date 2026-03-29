import { api } from './client';

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  fullName: string;
  role: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  refreshToken?: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),

  register: (data: { username: string; password: string; fullName: string; email?: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  me: () => api.get<AuthResponse>('/auth/me'),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  updateProfile: (data: {
    fullName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => api.put<AuthResponse>('/auth/profile', data),
};
