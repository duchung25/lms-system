import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMyCourses } from "../hook/useCourse.js";

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
                className="card h-100 text-decoration-none text-dark course-card"
                style={{ cursor: "pointer" }}
              >
                <div className="card-thumbnail mb-2" style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
                  <img 
                    src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"} 
                    alt={c.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--transition-base)" }}
                  />
                </div>
                <div className="card-body d-flex flex-column p-3">
                  <div className="fw-bold fs-body-sm text-dark mb-1 text-truncate-2" style={{ height: "42px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {c.title}
                  </div>
                  <div className="text-muted small mb-2">{c.level}</div>
                  <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">
                      {c.price === 0 ? "Miễn phí" : `${c.price.toLocaleString()} VNĐ`}
                    </span>
                    <span className="text-muted small text-truncate" style={{ maxWidth: "120px" }}>
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