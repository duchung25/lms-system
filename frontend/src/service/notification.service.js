import { notificationApi } from "../api/notification.api";

export const notificationService = {
  async getNotifications(params) {
    const res = await notificationApi.getNotifications(params);
    return Array.isArray(res.data?.data?.notifications)
      ? res.data.data.notifications
      : [];
  },

  async getUnreadCount() {
    const res = await notificationApi.getUnreadCount();
    return res.data?.data?.count ?? 0;
  },

  async markAsRead(notificationId) {
    const res = await notificationApi.markAsRead(notificationId);
    return res.data?.data?.notification ?? null;
  },

  async markAllAsRead() {
    const res = await notificationApi.markAllAsRead();
    return res.data?.data ?? null;
  },

  async deleteNotification(notificationId) {
    await notificationApi.deleteNotification(notificationId);
    return true;
  },
};
