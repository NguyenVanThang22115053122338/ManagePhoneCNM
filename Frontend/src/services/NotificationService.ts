import axiosClient from "./AxiosClient";
import type { Notification } from "./Interface";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await axiosClient.get<Notification[]>("/api/notifications");
    return res.data;
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

  /* ================= USER ================= */
  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    const res = await axiosClient.get(`/api/notifications/user/${userId}`);
    return res.data;
  },

  markAsRead: async (id: number) => {
    return axiosClient.put(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async (userId: number) => {
    return axiosClient.put(`/api/notifications/user/${userId}/read-all`);
  },

  deleteNotification: async (id: number) => {
    return axiosClient.delete(`/api/notifications/${id}`);
  }
};

