import AppLayout from "../layouts/AppLayout.jsx";
import NoSidebarLayout from "../layouts/NoSidebarLayout.jsx";
import HomePage from "../pages/homePage.jsx";
import CoursesPage from "../pages/coursesPage.jsx";
import SearchPage from "../pages/searchPage.jsx";
import CertificateVerifyPage from "../pages/certificateVerify.jsx";

export default [
  {
    element: <AppLayout />,
    children: [
      { path: "/courses", element: <CoursesPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/certificates/verify", element: <CertificateVerifyPage /> },
    ],
  },
  {
    element: <NoSidebarLayout/>,
    children: [
      { path: "/", element: <HomePage /> },
    ]
  }
];
