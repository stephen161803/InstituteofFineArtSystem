import { api } from './client';

export interface StaffDto {
  userId: number;
  fullName: string;
  email?: string;
  phone?: string;
  dateJoined?: string;
  subjectHandled?: string;
  remarks?: string;
}

export interface StudentDto {
  userId: number;
  fullName: string;
  email?: string;
  phone?: string;
  admissionNumber: string;
  admissionDate?: string;
  dateOfBirth?: string;
  address?: string;
}

export const usersApi = {
  getStaff: () => api.get<StaffDto[]>('/users/staff'),
  createStaff: (data: unknown) => api.post('/users/staff', data),
  updateStaff: (userId: number, data: unknown) => api.put(`/users/staff/${userId}`, data),
  deleteStaff: (userId: number) => api.delete(`/users/staff/${userId}`),

  getStudents: () => api.get<StudentDto[]>('/users/students'),
  createStudent: (data: unknown) => api.post('/users/students', data),
  updateStudent: (userId: number, data: unknown) => api.put(`/users/students/${userId}`, data),
  deleteStudent: (userId: number) => api.delete(`/users/students/${userId}`),
};
