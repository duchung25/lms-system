import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
// import AdminLayout from "../layouts/AdminLayout.jsx";
// import TeacherLayout from "../layouts/TeacherLayout.jsx";
import NoSidebarLayout from "../layouts/NoSidebarLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import SettingsPage from "../pages/settingsPage.jsx";
import CoursesPage from "../pages/coursesPage.jsx";
import MyProfile from "../pages/myProfile.jsx";
import UserManagement from "../pages/userManagement.jsx";
import MyCoursesPage from "../pages/myCoursesPage.jsx";
import StudentDashboard from "../pages/studentDashboard.jsx";
import MyCertificatesPage from "../pages/myCertificates.jsx";
import CourseForm from "../pages/courseForm.jsx";
import LessonForm from "../pages/lessonForm.jsx";
import LessonDetail from "../pages/lessonDetails.jsx";
import AdminDashboard from "../pages/adminDashboard.jsx";
import AdminCourseReview from "../pages/adminCourseReview.jsx";
import AdminCertificatesPage from "../pages/adminCertificates.jsx";
import PaymentPage from "../pages/paymentPage.jsx";
import TeacherDashboard from "../pages/teacherDashboard.jsx";
import AdminNavLink from "../pages/adminNavLink.jsx";
import CategoryManagementPage from "../pages/categoryManagement.jsx";
import CertificatePrintPage from "../pages/certificatePrint.jsx";
import NotificationsPage from "../pages/notificationsPage.jsx";
import AdminTeacherRequestsPage from "../pages/adminTeacherRequests.jsx";
import AdminOrdersPage from "../pages/adminOrders.jsx";
import NavFeaturePlaceholder from "../pages/navFeaturePlaceholder.jsx";
import LearningProgressPage from "../pages/learningProgress.jsx";

export default [
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/my-profile", element: <MyProfile /> },
          { path: "/certificates/:certificateId/print", element: <CertificatePrintPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/admin/courses", element: <CoursesPage /> },
          { path: "/admin/course-review", element: <AdminCourseReview /> },
          { path: "/admin/courses/review", element: <AdminCourseReview /> },
          { path: "/admin/certificates", element: <AdminCertificatesPage /> },
          { path: "/courses/:courseId/lessons/new", element: <LessonForm /> },
          { path: "/admin/users", element: <UserManagement /> },
          { path: "/admin/teacher-requests", element: <AdminTeacherRequestsPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
          {
            path: "/admin/ratings",
            element: (
              <NavFeaturePlaceholder
                roleLabel="Admin"
                title="Ratings"
                description="Tổng hợp đánh giá khóa học từ CourseRating và thống kê sẵn có trên Course."
                bullets={["Không cần collection mới.", "Có thể mở rộng bằng filter theo khóa học, giảng viên và số sao."]}
                primaryLink="/admin/dashboard"
                primaryLabel="Về Dashboard"
              />
            ),
          },
          {
            path: "/admin/comments",
            element: (
              <NavFeaturePlaceholder
                roleLabel="Admin"
                title="Comments"
                description="Quản trị bình luận từ LessonComment hiện có."
                bullets={["Tái sử dụng moderation/delete flow hiện tại.", "Có thể thêm tìm kiếm theo khóa học hoặc học viên sau."]}
                primaryLink="/admin/dashboard"
                primaryLabel="Về Dashboard"
              />
            ),
          },
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/navlinks", element: <AdminNavLink /> },
          { path: "/admin/categories", element: <CategoryManagementPage /> }
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["teacher"]} />,
        children: [
          { path: "/teacher/dashboard", element: <TeacherDashboard /> },
          { path: "/courses/create", element: <CourseForm /> },
          { path: "/courses/:courseId/edit", element: <CourseForm /> },
          { path: "/courses/:courseId/lessons/new", element: <LessonForm /> },
          {
            path: "/teacher/discussions",
            element: (
              <NavFeaturePlaceholder
                roleLabel="Teacher"
                title="Discussions"
                description="Tập trung các trao đổi bài học từ LessonComment hiện có."
                bullets={["Không dùng WebSocket.", "Có thể polling hoặc lọc comment theo course của giảng viên."]}
                primaryLink="/teacher/dashboard"
                primaryLabel="Về Dashboard"
              />
            ),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["teacher","student"]} />,
        children: [
          { path: "/courses/my-courses", element: <MyCoursesPage /> },
          {
            path: "/discussions",
            element: (
              <NavFeaturePlaceholder
                roleLabel="Learning"
                title="Discussions"
                description="Không gian tổng hợp trao đổi từ bình luận bài học."
                bullets={["Dùng LessonComment hiện có.", "Có thể mở rộng thành inbox thảo luận theo khóa học."]}
                primaryLink="/courses/my-courses"
                primaryLabel="Khóa học của tôi"
              />
            ),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          { path: "/dashboard", element: <StudentDashboard /> },
          { path: "/certificates", element: <MyCertificatesPage /> },
          { path: "/learning-progress", element: <LearningProgressPage /> },
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
  },
  {
    element: <NoSidebarLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />,
        children: [
          { path: "/settings", element: <SettingsPage /> },
          { path: "/admin/settings", element: <SettingsPage /> },
          { path: "/teacher/settings", element: <SettingsPage /> }
        ]
      }
    ]
  }
];
