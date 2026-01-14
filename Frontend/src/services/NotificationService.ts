import axiosClient from "./AxiosClient";
import type { Notification } from "./Interface";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await axiosClient.get<any>("/api/notifications");
    return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
  },

  create: async (payload: {
    title: string;
    content: string;
    notificationType: Notification["notificationType"];
    sendToAll: boolean;
    userIds?: number[];
  }) => {
    return axiosClient.post("/api/notifications", payload);
  },

  update: async (
    id: number,
    payload: {
      title: string;
      content: string;
      notificationType: Notification["notificationType"];
      sendToAll: boolean;
    }
  ) => {
    return axiosClient.put(`/api/notifications/${id}`, payload);
  },

  delete: async (notificationId: number) => {
    return axiosClient.delete(`/api/notifications/${notificationId}`);
  },

  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    const res = await axiosClient.get(`/api/notifications/user/${userId}`);
    return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
  },

  markAsRead: async (notificationId: number, userId: number) => {
    return axiosClient.put(`/api/notifications/${notificationId}/read/${userId}`);
  },

  markAllAsRead: async (userId: number) => {
    return axiosClient.put(`/api/notifications/read-all/${userId}`);
  },

  deleteNotification: async (id: number) => {
    return axiosClient.delete(`/api/notifications/${id}`);
  }
};