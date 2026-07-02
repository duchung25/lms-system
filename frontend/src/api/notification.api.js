import apiClient from "./apiClient";

export const notificationApi = {
  getNotifications(params) {
    return apiClient.get("/notifications", { params });
  },

  getUnreadCount() {
    return apiClient.get("/notifications/unread-count");
  },

  markAsRead(notificationId) {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead() {
    return apiClient.patch("/notifications/read-all");
  },

  deleteNotification(notificationId) {
    return apiClient.delete(`/notifications/${notificationId}`);
  },
};
