import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEnrolledCourses } from "../hook/useCourse";
import { FiAward, FiBookOpen, FiPlay, FiSearch } from "react-icons/fi";

export default function LearningProgressPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();

  const { courses, loading, error } = useEnrolledCourses(true);

  const filteredCourses = useMemo(() => {
    if (!q) return courses;
    return courses.filter((c) => (c.title || "").toLowerCase().includes(q));
  }, [q, courses]);

  const handleContinueLearning = (course) => {
    if (course.currentLessonId) {
      navigate(`/courses/${course._id}/lessons/${course.currentLessonId}`);
    } else {
      navigate(`/courses/${course._id}`);
    }
  };

  return (
    <div className="learning-progress-page container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <p className="text-primary fw-semibold mb-1" style={{ letterSpacing: "1px", fontSize: "0.85rem", textTransform: "uppercase" }}>
            Học viên
          </p>
          <h1 className="fw-bold text-dark m-0" style={{ fontSize: "2rem" }}>Tiến độ học tập</h1>
          <p className="text-muted m-0 mt-1" style={{ fontSize: "0.95rem" }}>
            Theo dõi tiến độ hoàn thành các khóa học của bạn và tiếp tục học tập.
          </p>
        </div>
        {q && (
          <span className="badge bg-secondary px-3 py-2 rounded-pill mt-2 mt-md-0" style={{ alignSelf: "flex-start" }}>
            Tìm kiếm: "{q}"
          </span>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3" role="alert">
          Lỗi: {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <div className="mb-3" style={{ fontSize: "3rem" }}>📚</div>
          <h3 className="fw-bold">Chưa tham gia khóa học nào</h3>
          <p className="text-muted mb-4">
            {q ? "Không tìm thấy khóa học nào phù hợp với từ khóa của bạn." : "Bạn chưa đăng ký khóa học nào. Hãy bắt đầu học ngay hôm nay!"}
          </p>
          <Link to="/courses" className="btn btn-primary rounded-pill px-4">
            Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((c) => {
            const isCompleted = c.progressPercent === 100;
            return (
              <div key={c._id} className="col-12 col-md-6 col-lg-4">
                <div 
                  className="card h-100 border-0 shadow-sm overflow-hidden learning-progress-card" 
                  style={{ 
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    borderRadius: "12px",
                    background: "#fff"
                  }}
                >
                  {/* Thumbnail & Badges */}
                  <div className="position-relative" style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <img 
                      src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"} 
                      alt={c.title} 
                      className="w-100 h-100"
                      style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                    />
                    <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
                      <span className="badge bg-dark bg-opacity-75 text-white" style={{ fontSize: "0.75rem" }}>
                        {c.level === "beginner" ? "Cơ bản" : c.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="position-absolute top-0 end-0 p-2">
                        <span className="badge bg-success d-flex align-items-center gap-1" style={{ fontSize: "0.75rem", padding: "6px 10px" }}>
                          <FiAward /> Đã hoàn thành
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="card-body d-flex flex-column p-4">
                    <h3 className="card-title fw-bold text-dark mb-2 h5" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.8rem" }}>
                      <Link to={`/courses/${c._id}`} className="text-decoration-none text-dark hover-primary">
                        {c.title}
                      </Link>
                    </h3>
                    
                    <p className="text-muted small mb-4" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.85rem", height: "2.4rem" }}>
                      {c.description || "Không có mô tả chi tiết."}
                    </p>

                    {/* Progress Bar Container */}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-muted" style={{ fontSize: "0.8rem", fontWeight: "500" }}>Tiến độ học</span>
                        <span className="small fw-bold text-primary" style={{ fontSize: "0.85rem" }}>{c.progressPercent}%</span>
                      </div>
                      <div className="progress mb-4" style={{ height: "8px", borderRadius: "4px", backgroundColor: "#e9ecef" }}>
                        <div 
                          className={`progress-bar rounded-pill ${isCompleted ? "bg-success" : "bg-primary"}`}
                          role="progressbar" 
                          style={{ width: `${c.progressPercent}%` }} 
                          aria-valuenow={c.progressPercent} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={() => handleContinueLearning(c)}
                        className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold ${isCompleted ? "btn-outline-success" : "btn-primary"}`}
                        style={{ fontSize: "0.9rem", transition: "all 0.2s ease" }}
                      >
                        {isCompleted ? (
                          <>
                            <FiBookOpen /> Ôn tập bài học
                          </>
                        ) : (
                          <>
                            <FiPlay /> Học tiếp
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
