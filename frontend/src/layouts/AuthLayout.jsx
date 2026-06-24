import { Outlet } from "react-router-dom";
import Header from "../components/header/header.jsx";

export default function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <div className="container-fluid flex-grow-1 px-0" style={{ marginTop: "var(--header-height)", backgroundColor: "var(--color-background)" }}>
        <Outlet />
      </div>
    </div>
  );
}