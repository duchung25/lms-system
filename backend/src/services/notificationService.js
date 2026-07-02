import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";

const notificationService = {
  async createNotification(notificationData) {
    return Notification.create(notificationData);
  },

  async createManyNotifications(notifications) {
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return [];
    }
    return Notification.insertMany(notifications, { ordered: false });
  },

  async getUserNotifications(userId, { limit = 50 } = {}) {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 50)
      .lean();
  },

  async getUnreadCount(userId) {
    return Notification.countDocuments({ userId, isRead: false });
  },

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    ).lean();

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  },

  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { modifiedCount: result.modifiedCount || 0 };
  },

  async deleteNotification(userId, notificationId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    }).lean();

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return { message: "Notification deleted successfully" };
  },
};

export default notificationService;
