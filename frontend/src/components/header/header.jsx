import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { useState, useRef, useEffect } from "react";
import { FaSortDown } from "../../icons/index.js";
import { IoIosSearch } from "../../icons/index.js";
import useNavLink from "../../hook/useNavLink.js";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  
  // SỬA Ở ĐÂY: Lấy trực tiếp state navLinks từ custom hook
  const { navLinks, fetchAllNavLinks } = useNavLink();

  useEffect(() => {
    // SỬA Ở ĐÂY: Chỉ cần gọi hàm fetch, hook sẽ tự cập nhật mảng navLinks
    fetchAllNavLinks().catch(err => {
      console.error('Failed to fetch nav links', err);
    });
  }, [fetchAllNavLinks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="header__container">

        <Link to="/" className="header__brand">
          <div className="header__brand-icon">🎓</div>
          <span className="header__title">StudyHub</span>
        </Link>

        <nav className="header__nav">
          {/* Render an toàn: Kiểm tra nếu navLinks có tồn tại và có phần tử thì mới map */}
          {navLinks && navLinks.length > 0 && navLinks.map((link) => (
            <NavLink
              key={link._id || link.id} // Đảm bảo lấy đúng trường ID từ DB của bạn
              to={link.url}
              className={({ isActive }) =>
                `header__nav-item${isActive ? " active" : ""}`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSubmit} className="header__search">
          <div className="header__search-wrap">
            <IoIosSearch className="header__search-icon" />
            <input
              className="header__input"
              placeholder="Tìm kiếm khóa học..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </form>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className={`user-menu${open ? " user-menu--open" : ""}`} ref={menuRef}>
              <button
                className="user-menu__trigger"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="user-menu__avatar" />
                ) : (
                  <div className="user-menu__avatar user-menu__avatar--placeholder" aria-label="User avatar">
                    {user?.username ? user.username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                  </div>
                )}
                {user?.username || "User"}
                <FaSortDown className="user-menu__chevron" />
              </button>

              {open && (
                <div className="user-menu__dropdown">
                  <Link to="/my-profile" className="user-menu__item" onClick={() => setOpen(false)}>
                    👤 Hồ sơ
                  </Link>
                  <Link to="/courses/my-courses" className="user-menu__item" onClick={() => setOpen(false)}>
                    📚 Khóa học của tôi
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin/dashboard" className="user-menu__item" onClick={() => setOpen(false)}>
                      🛡️ Admin Dashboard
                    </Link>
                  )}
                  {user?.role === "teacher" && (
                    <Link to="/teacher/dashboard" className="user-menu__item" onClick={() => setOpen(false)}>
                      📊 Teacher Dashboard
                    </Link>
                  )}
                  <div className="user-menu__divider" />
                  <button
                    className="user-menu__item danger"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/register" className="header__link">
                Đăng ký
              </Link>
              <Link to="/auth/login" className="btn btn-primary" style={{ padding: "8px 20px", borderRadius: "var(--radius-full)", fontSize: "14px" }}>
                Đăng nhập
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}