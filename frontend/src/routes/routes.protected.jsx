import AppLayout from "../layouts/AppLayout.jsx";
// import AdminLayout from "../layouts/AdminLayout.jsx";
// import TeacherLayout from "../layouts/TeacherLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import CoursesPage from "../pages/coursesPage.jsx";

import MyCoursesPage from "../pages/myCoursesPage.jsx";
import CreateCoursePage from "../pages/createCoursePage.jsx";

export default [
  // USER (đăng nhập là vào được)
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ path: "/my-courses", element: <MyCoursesPage /> }],
      },
    ],
  },

  // ADMIN
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          // { path: "/admin/dashboard", element: <AdminDashboardPage /> },
          { path: "/admin/courses", element: <CoursesPage /> },
        ],
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["teacher"]} />,
        children: [
          { path: "/courses/my-courses", element: <MyCoursesPage /> },
          { path: "/courses/create", element: <CreateCoursePage /> }
        ],
      },
    ],
  },
];