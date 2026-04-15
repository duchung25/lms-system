import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    `list-group-item list-group-item-action ${isActive ? "active" : ""}`;
  if(!user) return null;
  if(user.role === "admin"){
    return(
      <aside>
        <div className="list-group">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Admin Dashboard
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            Manage Courses
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            Manage Users
          </NavLink>
        </div>
      </aside>    
    );
  }
  if(user.role === "teacher"){
    return(
      <aside>
        <div className="list-group">
          <NavLink to="/teacher/dashboard" className={linkClass}>
            Teacher Dashboard
          </NavLink>
          <NavLink to="/courses/my-courses" className={linkClass}>
            My Courses
          </NavLink>
        </div>
      </aside>    
    );
  }
  return (
    <aside>
      <div className="list-group">
        <NavLink to="/courses" className={linkClass}>
          Trang chủ
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          Khóa học
        </NavLink>
        <NavLink to="/my-courses" className={linkClass}>
          Khóa học của tôi
        </NavLink>
      </div>
    </aside>
  );
}