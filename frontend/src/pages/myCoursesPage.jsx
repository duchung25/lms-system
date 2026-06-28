import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMyCourses } from "../hook/useCourse.js";
import { FaStar, FaStarHalfAlt, FaRegStar } from "../icons";

function CourseSkeleton() {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="card h-100 skeleton-card">
        <div className="skeleton skeleton-thumbnail mb-2" style={{ aspectRatio: "16/9", width: "100%" }}></div>
        <div className="card-body">
          <div className="skeleton skeleton-title mb-2" style={{ height: "20px", width: "80%" }}></div>
          <div className="skeleton skeleton-text mb-1" style={{ height: "14px", width: "40%" }}></div>
          <div className="skeleton skeleton-text mt-3" style={{ height: "16px", width: "30%" }}></div>
          <div className="skeleton skeleton-text mt-2" style={{ height: "14px", width: "60%" }}></div>
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim(); 

  const { courses, loading: coursesLoading, error } = useMyCourses();
  
  const filteredCourses = useMemo(() => {
    if(!q) return courses;
    return courses.filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [q, courses]);
   const RatingStars = ({ rating }) => {
      return (
        <>
          {[...Array(5)].map((_, index) => {
            if (rating >= index + 1) {
              return <FaStar key={index} color="#ffc107" />;
            }
  
            if (rating >= index + 0.5) {
              return <FaStarHalfAlt key={index} color="#ffc107" />;
            }
  
            return <FaRegStar key={index} color="#ddd" />;
          })}
        </>
      );
    };

  return (
    <div className="my-courses-container">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark m-0">Khóa Học Của Tôi</h2>
          <p className="text-muted small m-0 mt-1">Các khóa học bạn đang tham gia giảng dạy hoặc học tập</p>
        </div>
        {q && <span className="badge bg-secondary px-3 py-2 rounded-pill">Từ khóa: "{q}"</span>}
      </div>

      {/* Content Area */}
      {coursesLoading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3" role="alert">
          Lỗi: {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-state-icon fs-1 mb-3">📚</div>
          <h4 className="empty-state-title">Chưa có khóa học nào</h4>
          <p className="empty-state-text text-muted mb-4">
            Bạn chưa đăng ký hoặc chưa tạo khóa học nào. Hãy khám phá ngay nhé!
          </p>
          <Link to="/courses" className="btn btn-primary rounded-pill px-4">
            Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((c) => (
            <div key={c._id} className="col-12 col-sm-6 col-lg-3">
              <Link 
                to={`/courses/${c._id}`} 
                className="course-card"
              >
                <div className="card-thumbnail">
                  {/* Floating badges */}
                  <div className="card-badge-overlay">
                    <span className="card-badge badge-level">{c.level}</span>
                    {c.category && (
                      <span className="card-badge badge-category">{c.category}</span>
                    )}
                  </div>
                  <img 
                    src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"} 
                    alt={c.title} 
                    className="course-thumbnail-img"
                  />
                </div>
                <div className="card-body">
                  <h3 className="course-card-title">
                    {c.title}
                  </h3>
                  <div className="course-card-level">
                    <span>Trình độ: {c.level}</span>
                  </div>
                  <div className="course-rating">
                    <RatingStars rating={c.averageRating} />
                    <span className="course-rating-count">
                      ({c.ratingCount})
                    </span>
                  </div>
                  <div className="course-card-footer">
                    <span className={`course-card-price ${c.price === 0 ? "free" : ""}`}>
                      {c.price === 0 ? "Miễn phí" : `${c.price.toLocaleString()} VNĐ`}
                    </span>
                    <span className="course-card-teacher" title={c.teacherId?.email}>
                      GV: {c.teacherId?.username || c.teacherId?.email?.split("@")[0] || "Ẩn danh"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}