import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
// import AdminLayout from "../layouts/AdminLayout.jsx";
// import TeacherLayout from "../layouts/TeacherLayout.jsx";
import CourseDetails from "../pages/courseDetails.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CoursesPage from "../pages/coursesPage.jsx";
import MyProfile from "../pages/myProfile.jsx";
import UserManagement from "../pages/userManagement.jsx";
import MyCoursesPage from "../pages/myCoursesPage.jsx";
import CourseForm from "../pages/courseForm.jsx";
import LessonForm from "../pages/lessonForm.jsx";
import LessonDetail from "../pages/lessonDetails.jsx";
import AdminDashboard from "../pages/adminDashboard.jsx";
import PaymentPage from "../pages/paymentPage.jsx";
import TeacherDashboard from "../pages/teacherDashboard.jsx";
import AdminNavLink from "../pages/adminNavLink.jsx";

export default [
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/courses/:courseId", element: <CourseDetails /> },
          { path: "/my-profile", element: <MyProfile /> },
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/admin/courses", element: <CoursesPage /> },
          { path: "/courses/:courseId/lessons/new", element: <LessonForm /> },
          { path: "/admin/users", element: <UserManagement /> },
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/navlinks", element: <AdminNavLink /> }
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["teacher"]} />,
        children: [
          { path: "/teacher/dashboard", element: <TeacherDashboard /> },
          { path: "/courses/create", element: <CourseForm /> },
          { path: "/courses/:courseId/edit", element: <CourseForm /> },
          { path: "/courses/:courseId/lessons/new", element: <LessonForm /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["teacher","student"]} />,
        children: [
          { path: "/courses/my-courses", element: <MyCoursesPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          { path: "/payment/:orderId", element: <PaymentPage /> },
        ],
      }
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/courses/:courseId/lessons/:lessonId", element: <LessonDetail /> }
        ],
      },
    ],
  }
];