import { useRoutes, Navigate } from "react-router-dom";
import publicRoutes from "./routes.public.jsx";
import protectedRoutes from "./routes.protected.jsx";
import authRoutes from "./routes.auth.jsx";

export default function AppRoutes() {
  return useRoutes([
    ...publicRoutes,
    ...authRoutes,
    ...protectedRoutes,
    { path: "*", element: <Navigate to="/" replace /> },
  ]);
}