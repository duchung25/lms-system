import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  // Static course data for demo
  const featuredCourses = [
    {
      id: "course-1",
      title: "Lập Trình Web ReactJS Toàn Diện",
      category: "Programming",
      level: "Intermediate",
      rating: 4.9,
      reviews: 142,
      price: "1,290,000đ",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      teacher: "Nguyễn Văn A",
      tag: "Bán chạy"
    },
    {
      id: "course-2",
      title: "Thiết Kế Giao Diện UI/UX Chuyên Nghiệp",
      category: "Design",
      level: "Beginner",
      rating: 4.8,
      reviews: 98,
      price: "990,000đ",
      thumbnail: "https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      teacher: "Trần Thị B",
      tag: "Mới"
    },
    {
      id: "course-3",
      title: "Digital Marketing Cho Người Mới Bắt Đầu",
      category: "Marketing",
      level: "Beginner",
      rating: 4.7,
      reviews: 85,
      price: "Miễn phí",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      teacher: "Lê Hoàng C",
      tag: "Miễn phí"
    },
    {
      id: "course-4",
      title: "Phân Tích Dữ Liệu Với Python & SQL",
      category: "Business",
      level: "Advanced",
      rating: 4.9,
      reviews: 110,
      price: "1,590,000đ",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      teacher: "Phạm Minh D",
      tag: "Đánh giá cao"
    }
  ];

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content animate-fade-in-up">
              <span className="hero-badge animate-float">🚀 Nền Tảng Học Tập Thế Hệ Mới</span>
              <h1 className="hero-title">
                Nâng Tầm Tri Thức<br />
                <span className="text-gradient">Bứt Phá Tương Lai</span>
              </h1>
              <p className="hero-subtitle">
                Khám phá hàng ngàn khóa học chất lượng cao được giảng dạy bởi các chuyên gia hàng đầu. Học mọi lúc, mọi nơi, theo lộ trình cá nhân hóa của riêng bạn.
              </p>
              <div className="hero-ctas">
                <Link to="/courses" className="btn-primary-gradient">
                  Khám phá khóa học
                </Link>
                {!user && (
                  <Link to="/register" className="btn-outline-glass">
                    Đăng ký miễn phí
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6 hero-visual d-none d-lg-block">
              <div className="hero-image-container">
                <div className="glass-card main-card animate-float">
                  <div className="card-mock-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="LMS Visual" 
                    className="mock-img"
                  />
                  <div className="glass-card-badge success animate-bounce-in">
                    <span className="badge-icon">✓</span>
                    <span>120+ Học viên đang online</span>
                  </div>
                  <div className="glass-card-badge info animate-float">
                    <span className="badge-icon">⭐️</span>
                    <span>4.9/5 Đánh giá tích cực</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Học viên năng động</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Khóa học chất lượng</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">200+</h3>
              <p className="stat-label">Giảng viên uy tín</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">95%</h3>
              <p className="stat-label">Hoàn thành khóa học</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Giá trị cốt lõi</span>
            <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
            <p className="section-desc">Chúng tôi mang lại trải nghiệm học tập tối ưu với các công cụ hiện đại và tài liệu trực quan.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon bg-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <h4 className="feature-title">Học tập linh hoạt</h4>
                <p className="feature-text">Học mọi lúc mọi nơi trên mọi thiết bị. Tự do sắp xếp thời gian biểu phù hợp cá nhân.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon bg-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                </div>
                <h4 className="feature-title">Giảng viên uy tín</h4>
                <p className="feature-text">Các giảng viên đến từ các doanh nghiệp công nghệ lớn và trường đại học danh tiếng.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon bg-cyan">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h4 className="feature-title">Lộ trình rõ ràng</h4>
                <p className="feature-text">Lộ trình học tập chuẩn mực được cập nhật liên tục bám sát yêu cầu thực tiễn.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon bg-emerald">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h4 className="feature-title">Hỗ trợ 24/7</h4>
                <p className="feature-text">Đội ngũ trợ giảng hỗ trợ giải đáp mọi thắc mắc của bạn nhanh chóng nhất.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COURSES */}
      <section className="featured-courses-section">
        <div className="container">
          <div className="section-header d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="section-tag">Gợi ý dành cho bạn</span>
              <h2 className="section-title mb-0">Khóa Học Nổi Bật</h2>
            </div>
            <Link to="/courses" className="view-all-link">
              Xem tất cả khóa học →
            </Link>
          </div>

          <div className="row g-4">
            {featuredCourses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-3">
                <div className="landing-course-card">
                  <div className="course-card-image">
                    <img src={course.thumbnail} alt={course.title} />
                    <span className="course-card-tag">{course.tag}</span>
                  </div>
                  <div className="course-card-body">
                    <div className="course-card-meta">
                      <span className="course-category">{course.category}</span>
                      <span className="course-level">{course.level}</span>
                    </div>
                    <h4 className="course-title-text">{course.title}</h4>
                    <div className="course-rating">
                      <span className="stars">★ {course.rating}</span>
                      <span className="reviews">({course.reviews} đánh giá)</span>
                    </div>
                    <div className="course-footer">
                      <div className="teacher-info">
                        <div className="avatar-placeholder">{course.teacher.charAt(0)}</div>
                        <span>{course.teacher}</span>
                      </div>
                      <div className="price-tag">{course.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Đơn giản & Tiện lợi</span>
            <h2 className="section-title">Quy Trình Học Tập</h2>
            <p className="section-desc">Chỉ với 3 bước đơn giản, bạn đã có thể bắt đầu hành trình chinh phục tri thức mới.</p>
          </div>
          <div className="row justify-content-center g-4 mt-2">
            <div className="col-md-4 text-center step-item">
              <div className="step-number">1</div>
              <h4 className="step-title">Đăng ký tài khoản</h4>
              <p className="step-text">Tạo tài khoản nhanh chóng chỉ với vài click chuột và điền thông tin cơ bản.</p>
            </div>
            <div className="col-md-4 text-center step-item">
              <div className="step-number">2</div>
              <h4 className="step-title">Chọn khóa học phù hợp</h4>
              <p className="step-text">Khám phá thư viện khóa học phong phú ở nhiều chủ đề và trình độ.</p>
            </div>
            <div className="col-md-4 text-center step-item">
              <div className="step-number">3</div>
              <h4 className="step-title">Học & nhận chứng chỉ</h4>
              <p className="step-text">Học theo lộ trình video, giải các bài thực hành và nhận chứng nhận khi hoàn thành.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Đánh giá thực tế</span>
            <h2 className="section-title">Học Viên Nói Gì Về Chúng Tôi</h2>
            <p className="section-desc">Lắng nghe những chia sẻ thực tế từ các học viên đã trải nghiệm học tập.</p>
          </div>
          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-comment">
                  "Khóa học ReactJS rất dễ hiểu, giảng viên giải thích chi tiết các khái niệm khó. Sau khóa học mình đã tự tin apply được công việc Front-End Developer."
                </p>
                <div className="student-profile">
                  <div className="student-avatar" style={{ backgroundColor: "#4f46e5" }}>NH</div>
                  <div>
                    <h5 className="student-name">Nguyễn Văn Huy</h5>
                    <span className="student-role">Học viên ReactJS</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-comment">
                  "Nền tảng học mượt mà, video chất lượng cao, bài tập đi kèm trực quan. Đội ngũ trợ giảng hỗ trợ cực kỳ nhiệt tình, phản hồi chỉ trong vài phút."
                </p>
                <div className="student-profile">
                  <div className="student-avatar" style={{ backgroundColor: "#10b981" }}>TM</div>
                  <div>
                    <h5 className="student-name">Trần Thị Minh</h5>
                    <span className="student-role">Học viên UI/UX</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-comment">
                  "Lộ trình rõ ràng bám sát dự án thực tế. Mình đặc biệt thích cách giảng viên phân tích quy trình nghiệp vụ trước khi tiến hành code."
                </p>
                <div className="student-profile">
                  <div className="student-avatar" style={{ backgroundColor: "#f59e0b" }}>QD</div>
                  <div>
                    <h5 className="student-name">Phạm Quốc Dũng</h5>
                    <span className="student-role">Học viên Python</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner animate-fade-in-up">
            <h2 className="cta-title">Bắt Đầu Hành Trình Học Tập Hôm Nay</h2>
            <p className="cta-subtitle">Tham gia cùng hàng ngàn học viên để nâng cao kỹ năng và bứt phá trên con đường sự nghiệp của bạn.</p>
            <div className="cta-actions">
              <Link to="/courses" className="btn-secondary-gradient">
                Bắt đầu học ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}