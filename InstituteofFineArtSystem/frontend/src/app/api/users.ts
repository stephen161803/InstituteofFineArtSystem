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

export interface CustomerDto {
  id: number;
  userId: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
  purchaseCount?: number;
  totalSpent?: number;
}

export interface AdminUserDto {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

export const usersApi = {
  getStaff: () => api.get<StaffDto[]>('/users/staff'),
  createStaff: (data: unknown) => api.post('/users/staff', data),
  updateStaff: (userId: number, data: unknown) => api.put(`/users/staff/${userId}`, data),
  deleteStaff: (userId: number) => api.delete<{ message: string }>(`/users/staff/${userId}`),

  getStudents: () => api.get<StudentDto[]>('/users/students'),
  createStudent: (data: unknown) => api.post('/users/students', data),
  updateStudent: (userId: number, data: unknown) => api.put(`/users/students/${userId}`, data),
  deleteStudent: (userId: number) => api.delete(`/users/students/${userId}`),

  getCustomers: () => api.get<CustomerDto[]>('/users/customers'),
  updateCustomer: (customerId: number, data: unknown) => api.put(`/users/customers/${customerId}`, data),
  deleteCustomer: (customerId: number) => api.delete(`/users/customers/${customerId}`),

  getAdminUsers: () => api.get<AdminUserDto[]>('/users/admins'),
  createAdminUser: (data: unknown) => api.post('/users/admins', data),
  deleteAdminUser: (userId: number) => api.delete(`/users/admins/${userId}`),
};
