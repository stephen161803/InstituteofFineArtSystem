import { api } from './client';

export interface AwardDto {
  id: number;
  awardName: string;
  description?: string;
}

export interface StudentAwardDto {
  id: number;
  submissionId: number;
  awardId: number;
  awardName?: string;
  awardedBy: number;
  awardedDate: string;
  studentName?: string;
  competitionTitle?: string;
  submissionTitle?: string;
}

export const awardsApi = {
  getAwards: () => api.get<AwardDto[]>('/awards'),
  getStudentAwards: (params?: { submissionId?: number; studentId?: number }) => {
    const q = new URLSearchParams();
    if (params?.submissionId) q.set('submissionId', String(params.submissionId));
    if (params?.studentId) q.set('studentId', String(params.studentId));
    return api.get<StudentAwardDto[]>(`/awards/student-awards${q.size ? `?${q}` : ''}`);
  },
  grantAward: (submissionId: number, awardId: number) =>
    api.post('/awards/student-awards', { submissionId, awardId }),
  revokeAward: (id: number) => api.delete(`/awards/student-awards/${id}`),
};
