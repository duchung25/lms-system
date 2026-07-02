import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../../hook/useNotification";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
      })
    : "";

export default function RecentNotifications() {
  const { notifications, unreadCount, loading, error } = useNotifications({
    limit: 5,
    pollingMs: 30000,
  });

  return (
    <section className="recent-notifications-card">
      <div className="recent-notifications-head">
        <div>
          <h2>Thông báo gần đây</h2>
          <p>{unreadCount} thông báo chưa đọc</p>
        </div>
        <Link to="/notifications">Xem tất cả</Link>
      </div>

      {loading ? (
        <div className="recent-notifications-state">Đang tải...</div>
      ) : error ? (
        <div className="recent-notifications-state">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="recent-notifications-state">
          <FiBell />
          Chưa có thông báo mới.
        </div>
      ) : (
        <div className="recent-notifications-list">
          {notifications.slice(0, 5).map((notification) => (
            <Link
              to={notification.link || "/notifications"}
              className={`recent-notification${notification.isRead ? "" : " unread"}`}
              key={notification._id}
            >
              <span className="recent-notification-dot" />
              <div>
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
              </div>
              <time>{formatDate(notification.createdAt)}</time>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
