import notificationService from "../services/notificationService.js";

const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserNotifications(
        req.user.userId,
        req.query
      );

      res.status(200).json({
        success: true,
        message: "Notifications retrieved successfully",
        data: { notifications },
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.userId);

      res.status(200).json({
        success: true,
        message: "Unread notification count retrieved successfully",
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: { notification },
      });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.userId);

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.user.userId, req.params.id);

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default notificationController;
