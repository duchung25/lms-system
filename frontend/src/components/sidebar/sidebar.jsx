import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { FaAddressBook, FaBook, FaUserGraduate, FaHouseChimney, BiBook, BiHome, BiUser, BiSolidDashboard } from "../../icons";

export default function Sidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    `list-group-item list-group-item-action sidebar-link${isActive ? " active" : ""}`;

  if (!user) return null;

  if (user.role === "admin") {
    return (
      <aside className="sidebar">
        <div className="list-group sidebar-nav">
          <NavLink to="/" className={linkClass}>
            <span className="sidebar-link-icon"><BiHome /></span>
            <span className="sidebar-link-text">Home</span>
          </NavLink>
          <NavLink to="/admin/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><BiSolidDashboard /></span>
            <span className="sidebar-link-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            <span className="sidebar-link-icon"><BiBook /></span>
            <span className="sidebar-link-text">Courses</span>
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <span className="sidebar-link-icon"><BiUser /></span>
            <span className="sidebar-link-text">Users</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  if (user.role === "teacher") {
    return (
      <aside className="sidebar">
        <div className="list-group sidebar-nav">
          <Link to="/courses/create" className="btn btn-primary create-course-btn mb-2">
              <span>+</span>
              Create new course
            </Link>
          <NavLink to="/teacher/dashboard" className={linkClass}>
            <span className="sidebar-link-icon"><BiSolidDashboard /></span>
            <span className="sidebar-link-text">Dashboard</span>
          </NavLink>
          <NavLink to="/courses/my-courses" className={linkClass}>
            <span className="sidebar-link-icon"><BiBook /></span>
            <span className="sidebar-link-text">My Courses</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="list-group sidebar-nav">
        <NavLink to="/" className={linkClass}>
          <span className="sidebar-link-icon"><BiHome /></span>
          <span className="sidebar-link-text">Home</span>
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          <span className="sidebar-link-icon"><BiSolidDashboard /></span>
          <span className="sidebar-link-text">Dashboard</span>
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          <span className="sidebar-link-icon"><BiBook /></span>
          <span className="sidebar-link-text">Courses</span>
        </NavLink>
        <NavLink to="/courses/my-courses" className={linkClass}>
          <span className="sidebar-link-icon"><BiUser /></span>
          <span className="sidebar-link-text">My Courses</span>
        </NavLink>
      </div>
    </aside>
  );
}