import AppLayout from "../layouts/AppLayout.jsx";
import HomePage from "../pages/homePage.jsx";
import CoursesPage from "../pages/coursesPage.jsx";
import SearchPage from "../pages/searchPage.jsx";

export default [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/courses", element: <CoursesPage /> },
      { path: "/search", element: <SearchPage /> },
    ],
  },
];