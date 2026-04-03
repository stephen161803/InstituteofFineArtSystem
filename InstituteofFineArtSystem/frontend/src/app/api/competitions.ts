import { api } from './client';
import type { CompetitionAwardDto } from './awards';

export interface CompetitionCriteriaDto {
  id: number;
  competitionId: number;
  criteriaId: number;
  weightPercent: number;
  criteriaCode?: string;
  criteriaName?: string;
}

export interface CompetitionDto {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy?: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  criteria: CompetitionCriteriaDto[];
  awards: CompetitionAwardDto[];
}

export interface CriteriaDto {
  id: number;
  criteriaCode: string;
  criteriaName: string;
  isActive: boolean;
}

export const competitionsApi = {
  getAll: () => api.get<CompetitionDto[]>('/competitions'),
  getById: (id: number) => api.get<CompetitionDto>(`/competitions/${id}`),
  getCriteria: () => api.get<CriteriaDto[]>('/competitions/criteria'),
  createCriteria: (criteriaName: string) =>
    api.post<CriteriaDto>('/competitions/criteria', { criteriaName }),
  create: (data: unknown) => api.post<CompetitionDto>('/competitions', data),
  update: (id: number, data: unknown) => api.put<CompetitionDto>(`/competitions/${id}`, data),
  delete: (id: number) => api.delete(`/competitions/${id}`),
};
