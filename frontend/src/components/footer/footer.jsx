import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">

        {/* TOP GRID */}
        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__brand-logo">
              <div className="footer__brand-icon">🎓</div>
              <span className="footer__brand-name">StudyHub</span>
            </Link>
            <p className="footer__brand-desc">
              Nền tảng học trực tuyến hàng đầu. Khám phá hàng nghìn khóa học
              từ các giảng viên chuyên nghiệp, học mọi lúc mọi nơi.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">f</a>
              <a href="#" className="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="footer__social-link" aria-label="Youtube">▶</a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">in</a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <p className="footer__col-title">Khóa học</p>
            <ul className="footer__links">
              <li><Link to="/courses">Tất cả khóa học</Link></li>
              <li><Link to="/courses?category=Programming">Lập trình</Link></li>
              <li><Link to="/courses?category=Design">Thiết kế</Link></li>
              <li><Link to="/courses?category=Business">Kinh doanh</Link></li>
              <li><Link to="/courses?category=Marketing">Marketing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer__col-title">Công ty</p>
            <ul className="footer__links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Báo chí</a></li>
              <li><a href="#">Đối tác</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="footer__col-title">Hỗ trợ</p>
            <ul className="footer__links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Cộng đồng</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} StudyHub. Bảo lưu mọi quyền.
          </p>
          <div className="footer__bottom-links">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <a href="#">Cookie</a>
          </div>
        </div>

      </div>
    </footer>
  );
}