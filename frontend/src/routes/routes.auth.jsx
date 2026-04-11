import AuthLayout from "../layouts/AuthLayout.jsx";
import LoginPage from "../pages/loginPage.jsx";
import RegisterPage from "../pages/registerPage.jsx";

export default [
  {
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
    ],
  },
];