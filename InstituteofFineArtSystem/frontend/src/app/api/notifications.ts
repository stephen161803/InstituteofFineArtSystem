import { api } from './client';

export interface NotificationDto {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  competitionId?: number;
  submissionId?: number;
  awardId?: number;
  exhibitionId?: number;
  timestamp: string;
}

export const notificationsApi = {
  getMine: () => api.get<NotificationDto[]>('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`, {}),
  markAllRead: () => api.put('/notifications/read-all', {}),
};
