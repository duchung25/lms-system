import { Link } from "react-router-dom";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { useNotifications } from "../hook/useNotification";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications({ limit: 100, pollingMs: 30000 });

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <p className="notifications-eyebrow">Trung tâm thông báo</p>
          <h1>Thông báo</h1>
          <p>Theo dõi các cập nhật quan trọng trong hệ thống học tập.</p>
        </div>

        <div className="notifications-count">
          <FiBell />
          <strong>{unreadCount}</strong>
          <span>chưa đọc</span>
        </div>
      </div>

      <div className="notifications-toolbar">
        <button
          type="button"
          className="btn btn-white"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <FiCheck />
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {loading ? (
        <div className="notifications-state">Đang tải thông báo...</div>
      ) : error ? (
        <div className="notifications-state error">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <FiBell />
          <h2>Chưa có thông báo</h2>
          <p>Các cập nhật mới sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const content = (
              <>
                <div className="notification-main">
                  <div className="notification-title-row">
                    <h2>{notification.title}</h2>
                    {!notification.isRead && <span>Chưa đọc</span>}
                  </div>
                  <p>{notification.message}</p>
                  <time>{formatDateTime(notification.createdAt)}</time>
                </div>
              </>
            );

            return (
              <article
                className={`notification-item${notification.isRead ? "" : " unread"}`}
                key={notification._id}
              >
                {notification.link ? (
                  <Link
                    to={notification.link}
                    className="notification-link"
                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="notification-link">{content}</div>
                )}

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      type="button"
                      title="Đánh dấu đã đọc"
                      onClick={() => markAsRead(notification._id)}
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Xóa thông báo"
                    onClick={() => removeNotification(notification._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
