import { api } from './client';

export interface SaleDto {
  id: number;
  exhibitionSubmissionId: number;
  customerId: number;
  customerName?: string;
  soldPrice: number;
  soldDate: string;
  submissionTitle?: string;
  exhibitionTitle?: string;
  workUrl?: string;
}

export interface ExhibitionSubmissionDto {
  id: number;
  exhibitionId: number;
  submissionId: number;
  submissionTitle?: string;
  studentName?: string;
  workUrl?: string;
  proposedPrice: number;
  status: 'Available' | 'Sold' | 'Returned';
  sale?: SaleDto;
}

export interface ExhibitionDto {
  id: number;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status: 'Planned' | 'Upcoming' | 'Ongoing' | 'Completed' | string;
  submissions: ExhibitionSubmissionDto[];
}

export const exhibitionsApi = {
  getAll: () => api.get<ExhibitionDto[]>('/exhibitions'),
  getById: (id: number) => api.get<ExhibitionDto>(`/exhibitions/${id}`),
  create: (data: unknown) => api.post<ExhibitionDto>('/exhibitions', data),
  update: (id: number, data: unknown) => api.put<ExhibitionDto>(`/exhibitions/${id}`, data),
  delete: (id: number) => api.delete(`/exhibitions/${id}`),
  addSubmission: (exhibitionId: number, submissionId: number, proposedPrice: number) =>
    api.post(`/exhibitions/${exhibitionId}/submissions`, { submissionId, proposedPrice }),
  removeSubmission: (esId: number) => api.delete(`/exhibitions/submissions/${esId}`),
  purchase: (data: { exhibitionSubmissionId: number; soldPrice: number; address?: string }) =>
    api.post('/exhibitions/purchase', data),
  createSale: (data: { exhibitionSubmissionId: number; customerId: number; soldPrice: number }) =>
    api.post('/exhibitions/sales', data),
  getMySales: () => api.get<SaleDto[]>('/exhibitions/my-sales'),
};
