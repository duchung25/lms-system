import { Outlet } from "react-router-dom";
import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";

export default function NoSidebarLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "var(--color-background)" }}>
      <Header />

      <div className="flex-grow-1 d-flex" style={{ marginTop: "var(--header-height)" }}>
        <main className={`app-content flex-grow-1`}>
          <div className="container-fluid py-4 px-md-4">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}