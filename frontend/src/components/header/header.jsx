import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { useState } from "react";
import logo from "../../assets/img/logo_header.png";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [q, setQ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="bg-white border-bottom">
      <div className="container-fluid py-3 px-lg-4">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <Link to="/" className="text-decoration-none fw-bold text-dark d-flex align-items-center gap-2">
            <img src={logo} alt="Logo"  className="header__logo"/>
            Hungry Academy
          </Link>

          <form onSubmit={handleSubmit} className="header__search-form px-3">
            <input
              className="form-control rounded-pill"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-truncate" style={{ maxWidth: 160 }}>
                  {user?.name || user?.email || "User"}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/register" className="btn btn-link text-decoration-none">
                  Đăng ký
                </Link>
                <Link to="/auth/login" className="btn btn-link text-decoration-none br-4 login-btn">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}