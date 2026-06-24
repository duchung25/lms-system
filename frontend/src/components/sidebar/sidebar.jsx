import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { BiBook, BiHome, BiUser, BiSolidDashboard } from "../../icons";

export default function Sidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    `sidebar-link${isActive ? " active" : ""}`;

  if (!user) return null;

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
          <NavLink to="/admin/users" className={linkClass}>
            <span className="sidebar-link-icon"><BiUser /></span>
            <span className="sidebar-link-text">Người dùng</span>
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
        </nav>
      </aside>
    );
  }

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
          <span className="sidebar-link-icon"><BiBook /></span>
          <span className="sidebar-link-text">Khóa học</span>
        </NavLink>
        <NavLink to="/courses/my-courses" className={linkClass}>
          <span className="sidebar-link-icon"><BiUser /></span>
          <span className="sidebar-link-text">Khóa học của tôi</span>
        </NavLink>
      </nav>
    </aside>
  );
}