import { useCallback, useEffect, useState } from "react";
import { notificationService } from "../service/notification.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useNotifications = ({ limit = 50, pollingMs = 30000, enabled = true } = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const [list, count] = await Promise.all([
        notificationService.getNotifications({ limit }),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
      setError(getErrorMessage(err) || "Không thể tải thông báo.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return undefined;
    }

    refresh();

    if (!pollingMs) return undefined;
    const timer = setInterval(() => {
      refresh({ silent: true });
    }, pollingMs);

    return () => clearInterval(timer);
  }, [enabled, pollingMs, refresh]);

  const markAsRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    await refresh({ silent: true });
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await refresh({ silent: true });
  };

  const removeNotification = async (notificationId) => {
    await notificationService.deleteNotification(notificationId);
    await refresh({ silent: true });
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
};
