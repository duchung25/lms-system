import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/img/logo_header.png";
import { FaSortDown } from "../../icons/index.js";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        {/* Brand */}
        <Link to="/" className="header__brand">
          <img src={logo} alt="Logo" className="header__logo" />
          <span className="text-feature-title">Hungry Academy</span>
        </Link>

        <form onSubmit={handleSubmit} className="header__search">
          <input
            className="header__input"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className="user-menu" ref={menuRef}>
              <button
                className={`user-menu__trigger ${open ? "is-open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                <span className="user-menu__name">
                  {user?.username || "User"}
                </span>
                <span className="user-menu__caret d-flex align-items-center">
                  <FaSortDown />
                </span>
              </button>

              {open && (
                <div className="user-menu__dropdown">
                  <Link
                    to="/profile"
                    className="user-menu__item"
                    onClick={() => setOpen(false)}
                  >
                    Hồ sơ
                  </Link>

                  <Link
                    to="/my-courses"
                    className="user-menu__item"
                    onClick={() => setOpen(false)}
                  >
                    Khóa học của tôi
                  </Link>

                  <button
                    className="user-menu__item user-menu__item--danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/register" className="header__link">
                Đăng ký
              </Link>
              <Link to="/auth/login" className="btn btn-primary">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}