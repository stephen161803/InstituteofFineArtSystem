import { api } from './client';

export interface GradeDetailDto {
  id: number;
  reviewId: number;
  criteriaId: number;
  criteriaCode?: string;
  criteriaName?: string;
  rawScore: number;
  weightPercent?: number;
}

export interface SubmissionReviewDto {
  id: number;
  submissionId: number;
  staffId: number;
  staffName?: string;
  ratingLevel: string;
  strengths?: string;
  weaknesses?: string;
  improvements?: string;
  reviewedAt: string;
  gradeDetails: GradeDetailDto[];
}

export interface SubmissionDto {
  id: number;
  competitionId: number;
  studentId: number;
  studentName?: string;
  title?: string;
  workUrl?: string;
  fileName?: string;
  proposedPrice: number;
  description?: string;
  quotation?: string;
  poem?: string;
  submittedAt: string;
  review?: SubmissionReviewDto;
}

export const submissionsApi = {
  getAll: (competitionId?: number) =>
    api.get<SubmissionDto[]>(`/submissions${competitionId ? `?competitionId=${competitionId}` : ''}`),
  getById: (id: number) => api.get<SubmissionDto>(`/submissions/${id}`),
  create: (data: unknown) => api.post<SubmissionDto>('/submissions', data),
  update: (id: number, data: unknown) => api.put<SubmissionDto>(`/submissions/${id}`, data),
  delete: (id: number) => api.delete(`/submissions/${id}`),
  createReview: (submissionId: number, data: unknown) =>
    api.post(`/submissions/${submissionId}/review`, data),
};
