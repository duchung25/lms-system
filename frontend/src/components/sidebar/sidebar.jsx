import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { BiBook, BiHome, BiUser, BiSolidDashboard } from "../../icons";
import {
  FiAward,
  FiBarChart2,
  FiBell,
  FiClipboard,
  FiDollarSign,
  FiEdit3,
  FiGrid,
  FiMessageSquare,
  FiPlusCircle,
  FiSettings,
  FiStar,
  FiTrendingUp,
  FiUserCheck,
} from "react-icons/fi";
import { useNotifications } from "../../hook/useNotification";

export default function Sidebar() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications({
    limit: 5,
    pollingMs: 30000,
    enabled: Boolean(user),
  });
  const linkClass = ({ isActive }) =>
    `sidebar-link${isActive ? " active" : ""}`;

  const notificationLink = (
    <NavLink to="/notifications" className={linkClass}>
      <span className="sidebar-link-icon"><FiBell /></span>
      <span className="sidebar-link-text">Thông báo</span>
      {unreadCount > 0 && (
        <span className="sidebar-unread-badge">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </NavLink>
  );
  if(!user || user.role === "student"){
      return (
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Học viên</div>
            <NavLink to="/" className={linkClass}>
              <span className="sidebar-link-icon"><BiHome /></span>
              <span className="sidebar-link-text">Trang chủ</span>
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              <span className="sidebar-link-icon"><BiSolidDashboard /></span>
              <span className="sidebar-link-text">Bảng điều khiển</span>
            </NavLink>
            <NavLink to="/courses" className={linkClass}>
              <span className="sidebar-link-icon"><FiBarChart2 /></span>
              <span className="sidebar-link-text">Khóa học</span>
            </NavLink>
            <NavLink to="/courses/my-courses" className={linkClass}>
              <span className="sidebar-link-icon"><BiBook /></span>
              <span className="sidebar-link-text">Khóa học của tôi</span>
            </NavLink>
            <NavLink to="/learning-progress" className={linkClass}>
              <span className="sidebar-link-icon"><FiTrendingUp /></span>
              <span className="sidebar-link-text">Tiến độ học tập</span>
            </NavLink>
            <NavLink to="/certificates" className={linkClass}>
              <span className="sidebar-link-icon"><FiAward /></span>
              <span className="sidebar-link-text">Chứng chỉ</span>
            </NavLink>
            {notificationLink}
            <NavLink to="/my-profile" className={linkClass}>
              <span className="sidebar-link-icon"><BiUser /></span>
              <span className="sidebar-link-text">Hồ sơ</span>
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              <span className="sidebar-link-icon"><FiSettings /></span>
              <span className="sidebar-link-text">Cài đặt</span>
            </NavLink>
          </nav>
        </aside>
      );
    }
  if (user.role === "admin") {
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Hệ thống</div>
          <NavLink to="/" className={linkClass}>
            <span className="sidebar-link-icon"><BiHome /></span>
            <span className="sidebar-link-text">Trang chủ</span>
          </NavLink>
          <NavLink to="/admin/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><BiSolidDashboard /></span>
            <span className="sidebar-link-text">Bảng điều khiển</span>
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            <span className="sidebar-link-icon"><BiBook /></span>
            <span className="sidebar-link-text">Khóa học</span>
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            <span className="sidebar-link-icon"><FiGrid /></span>
            <span className="sidebar-link-text">Danh mục</span>
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <span className="sidebar-link-icon"><BiUser /></span>
            <span className="sidebar-link-text">Người dùng</span>
          </NavLink>
          <NavLink to="/admin/teacher-requests" className={linkClass}>
            <span className="sidebar-link-icon"><FiUserCheck /></span>
            <span className="sidebar-link-text">Yêu cầu giảng viên</span>
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <span className="sidebar-link-icon"><FiDollarSign /></span>
            <span className="sidebar-link-text">Đơn hàng</span>
          </NavLink>
          <NavLink to="/admin/ratings" className={linkClass}>
            <span className="sidebar-link-icon"><FiStar /></span>
            <span className="sidebar-link-text">Đánh giá</span>
          </NavLink>
          <NavLink to="/admin/comments" className={linkClass}>
            <span className="sidebar-link-icon"><FiMessageSquare /></span>
            <span className="sidebar-link-text">Bình luận</span>
          </NavLink>
          {notificationLink}
          <NavLink to="/admin/settings" className={linkClass}>
            <span className="sidebar-link-icon"><FiSettings /></span>
            <span className="sidebar-link-text">Cài đặt</span>
          </NavLink>
          <NavLink to="/admin/course-review" className={linkClass}>
            <span className="sidebar-link-icon"><FiClipboard /></span>
            <span className="sidebar-link-text">Duyệt khóa học</span>
          </NavLink>
          <NavLink to="/admin/certificates" className={linkClass}>
            <span className="sidebar-link-icon"><FiAward /></span>
            <span className="sidebar-link-text">Chứng chỉ</span>
          </NavLink>
          <NavLink to="/admin/navlinks" className={linkClass}>
            <span className="sidebar-link-text">Quản lý Menu</span>
          </NavLink>  
        </nav>
      </aside>
    );
  }

  if (user.role === "teacher") {
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <Link to="/courses/create" className="sidebar-create-btn">
            <span className="create-icon">+</span>
            <span className="create-text">Tạo khóa học</span>
          </Link>
          <div className="sidebar-section-label">Giảng viên</div>
          <NavLink to="/teacher/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><BiSolidDashboard /></span>
            <span className="sidebar-link-text">Bảng điều khiển</span>
          </NavLink>
          <NavLink to="/courses/my-courses" className={linkClass}>
            <span className="sidebar-link-icon"><BiBook /></span>
            <span className="sidebar-link-text">Khóa học của tôi</span>
          </NavLink>
          <NavLink to="/courses/create" className={linkClass}>
            <span className="sidebar-link-icon"><FiPlusCircle /></span>
            <span className="sidebar-link-text">Tạo khóa học</span>
          </NavLink>
          <NavLink to="/teacher/discussions" className={linkClass}>
            <span className="sidebar-link-icon"><FiMessageSquare /></span>
            <span className="sidebar-link-text">Thảo luận</span>
          </NavLink>
          {notificationLink}
          <NavLink to="/my-profile" className={linkClass}>
            <span className="sidebar-link-icon"><BiUser /></span>
            <span className="sidebar-link-text">Hồ sơ</span>
          </NavLink>
          <NavLink to="/teacher/settings" className={linkClass}>
            <span className="sidebar-link-icon"><FiSettings /></span>
            <span className="sidebar-link-text">Cài đặt</span>
          </NavLink>
        </nav>
      </aside>
    );
  }
  
}
