import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; 
import ForbiddenPage from "../pages/forbiddenPage.jsx";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and keep the current URL as query parameter
    const loginUrl = `/auth/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={loginUrl} replace />;
  }

  // If role is specified, check it
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <ForbiddenPage />;
    }
  }

  return <Outlet />;
}