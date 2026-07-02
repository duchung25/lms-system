import { useRoutes, Navigate } from "react-router-dom";
import publicRoutes from "./routes.public.jsx";
import protectedRoutes from "./routes.protected.jsx";
import authRoutes from "./routes.auth.jsx";
import NotFoundPage from "../pages/notFoundPage.jsx";

export default function AppRoutes() {
  return useRoutes([
    ...publicRoutes,
    ...authRoutes,
    ...protectedRoutes,
    { path: "*", element: <NotFoundPage /> },
  ]);
}