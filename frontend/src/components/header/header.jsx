import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { useState, useRef, useEffect } from "react";
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

        <Link to="/" className="header__brand">
          <span className="header__title">StudyHub</span>
        </Link>

        <nav className="header__nav">
          <Link to="/browse" className="header__nav-item active">Browse</Link>
          <Link to="/learning" className="header__nav-item">Learning</Link>
          <Link to="/community" className="header__nav-item">Community</Link>
          <Link to="/resources" className="header__nav-item">Resources</Link>
        </nav>

        <form onSubmit={handleSubmit} className="header__search">
          <input
            className="header__input"
            placeholder="Search courses..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-menu__trigger"
                onClick={() => setOpen((v) => !v)}
              >
                {user?.username || "User"}
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="user-menu__avatar" />
                ) : (
                  <div className="user-menu__avatar user-menu__avatar--placeholder" aria-label="User avatar">
                    {user?.username ? user.username.split(" ").map(n => n[0]).join("").toUpperCase() : "N/A"}
                  </div>
                )}
                <FaSortDown />
              </button>

              {open && (
                <div className="user-menu__dropdown">
                  <Link to="/my-profile" className="user-menu__item">Hồ sơ</Link>
                  <Link to="/my-courses" className="user-menu__item">Khóa học của tôi</Link>
                  <button
                    className="user-menu__item danger"
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
                Sign Up
              </Link>
              <Link to="/auth/login" className="btn btn-primary">
                Sign In
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}