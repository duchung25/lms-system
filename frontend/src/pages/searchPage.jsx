import { Link, useSearchParams } from "react-router-dom";
import { useCourses } from "../hook/useCourse";
import { useAuth } from "../auth/useAuth";
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

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() || "";
  const { user } = useAuth();
  const { courses, loading, error } = useCourses({ q });

  return (
    <div className="container" style={{ paddingTop: "10px", paddingBottom: "60px" }}>
      {/* Search Header */}
      <div className="mb-4">
        <h1 className="h3 font-weight-bold text-dark mb-2">
          Kết quả tìm kiếm cho: "{q}"
        </h1>
        {!loading && !error && (
          <p className="text-secondary">
            Tìm thấy {courses.length} khóa học phù hợp
          </p>
        )}
      </div>

      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3" role="alert">
          Có lỗi xảy ra: {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">Không tìm thấy kết quả</h3>
          <p className="empty-state-text">
            Thử tìm kiếm với từ khóa khác để khám phá thêm nhiều khóa học thú vị khác.
          </p>
          <Link to="/" className="btn btn-outline-primary rounded-pill px-4">
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((c) => (
            <div key={c._id} className="col-12 col-sm-6 col-lg-3">
              <Link to={`/courses/${c._id}`} className="course-card">
                <div className="card-thumbnail">
                  <div className="card-badge-overlay">
                    {c.categoryId?.name && (
                      <span className="card-badge badge-category" style={{ textTransform: "capitalize" }}>
                        {c.categoryId.name}
                      </span>
                    )}
                    {user?.role === "admin" && c.status && (
                      <span className="card-badge badge-level">{c.status}</span>
                    )}
                  </div>
                  <img
                    src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                    alt={c.title}
                    className="course-thumbnail-img"
                  />
                </div>
                <div className="card-body">
                  <h3 className="course-card-title">{c.title}</h3>
                  <div className="course-card-level">
                    <span>Trình độ: {c.level}</span>
                  </div>
                  <div className="course-rating">
                    <RatingStars rating={c.averageRating} />
                    <span className="course-rating-count">({c.ratingCount || 0})</span>
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
