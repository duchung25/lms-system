import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { FaAddressBook, FaBook, FaUserGraduate, FaHouseChimney } from "../../icons";

export default function Sidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    `list-group-item list-group-item-action sidebar-link${isActive ? " active" : ""}`;

  if (!user) return null;

  if (user.role === "admin") {
    return (
      <aside className="sidebar">
        <div className="list-group sidebar-nav">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><FaAddressBook /></span>
            <span className="sidebar-link-text">Admin Dashboard</span>
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            <span className="sidebar-link-icon"><FaBook /></span>
            <span className="sidebar-link-text">Manage Courses</span>
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <span className="sidebar-link-icon"><FaUserGraduate /></span>
            <span className="sidebar-link-text">Manage Users</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  if (user.role === "teacher") {
    return (
      <aside className="sidebar">
        <div className="list-group sidebar-nav">
          <NavLink to="/teacher/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><FaAddressBook /></span>
            <span className="sidebar-link-text">Teacher Dashboard</span>
          </NavLink>
          <NavLink to="/courses/my-courses" className={linkClass}>
            <span className="sidebar-link-icon"><FaBook /></span>
            <span className="sidebar-link-text">My Courses</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  // Default user
  return (
    <aside className="sidebar">
      <div className="list-group sidebar-nav">
        <NavLink to="/courses" className={linkClass}>
          <span className="sidebar-link-icon"><FaHouseChimney /></span>
          <span className="sidebar-link-text">Trang chủ</span>
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          <span className="sidebar-link-icon"><FaBook /></span>
          <span className="sidebar-link-text">Khóa học</span>
        </NavLink>
        <NavLink to="/my-courses" className={linkClass}>
          <span className="sidebar-link-icon"><FaUserGraduate /></span>
          <span className="sidebar-link-text">Khóa học của tôi</span>
        </NavLink>
      </div>
    </aside>
  );
}