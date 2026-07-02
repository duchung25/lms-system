import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../auth/useAuth";
import { useCourses } from "../hook/useCourse";
import { FaBoxArchive, FaClipboardCheck, IoIosSearch, FaStar, FaStarHalfAlt, FaRegStar } from "../icons";


const LEVEL_OPTIONS = [
  { value: "", label: "Tất cả trình độ" },
  { value: "Beginner", label: "Cơ bản (Beginner)" },
  { value: "Intermediate", label: "Trung cấp (Intermediate)" },
  { value: "Advanced", label: "Nâng cao (Advanced)" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả danh mục" },
  { value: "Programming", label: "Lập trình" },
  { value: "Design", label: "Thiết kế" },
  { value: "Marketing", label: "Marketing" },
  { value: "Business", label: "Kinh doanh" },
  { value: "Other", label: "Khác" },
];

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

export default function CoursesPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const q = (params.get("q") || "").toLowerCase().trim();
  const category = params.get("category") || "";
  const level = params.get("level") || "";
  const status = params.get("status") || "";
  const published = params.get("published") || "";
  const deleted = params.get("deleted") || "";
  const [searchInput, setSearchInput] = useState(q);
  
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const { courses, pendingCount, loading, error } = useCourses({ 
    q, 
    category,
    level, 
    status,
    published, 
    deleted, 
    role: user?.role 
  });

  const filterCourse = useMemo(() => {
    if(!q) return courses;
    return courses.filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [q, courses]);

  const updateFilter = useMemo(() => {
    return debounce((key, value) => {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        return newParams;
      }, { replace: true });
    }, 300);
  }, [setParams]);
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
    <div className="courses-page-container">
      {/* Page Header */}
      <div className="courses-page-header">
        <h1 className="courses-page-title">Khám Phá Khóa Học</h1>
        <p className="courses-page-subtitle">
          Tìm kiếm và bắt đầu các khóa học phù hợp với mục tiêu phát triển của bạn.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search-wrap">
          <IoIosSearch className="filter-search-icon" />
          <input
            type="text"
            className="filter-input"
            value={searchInput}
            placeholder="Tìm kiếm tên khoá học..."
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateFilter("q", e.target.value);
            }}
          />
        </div>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={level}
          onChange={(e) => updateFilter("level", e.target.value)}
        >
          {LEVEL_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {user && user.role === "admin" && (
          <div className="admin-actions">
            <Link
              to="/admin/courses?deleted=true"
              className="btn-icon-badge"
              title="Khóa học đã ẩn"
            >
              <FaBoxArchive />
            </Link>
            <Link
              to="/admin/course-review"
              className="btn-icon-badge"
              title="Khóa học chờ duyệt"
            >
              <FaClipboardCheck />
              {pendingCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {pendingCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-danger rounded-3" role="alert">
          Có lỗi xảy ra: {error}
        </div>
      ) : filterCourse.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">Không tìm thấy kết quả</h3>
          <p className="empty-state-text">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm nhiều khóa học thú vị khác.
          </p>
          <button
            className="btn btn-outline-primary rounded-pill px-4"
            onClick={() => {
              setSearchInput("");
              setParams({});
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filterCourse.map((c) => (
            <div key={c._id} className="col-12 col-sm-6 col-lg-3">
              <Link
                to={`/courses/${c._id}`}
                className="course-card"
              >
                <div className="card-thumbnail">
                  {/* Floating badges */}
                  <div className="card-badge-overlay">
                    {c.categoryId?.name && (
                      <span className="card-badge badge-category" style={{ textTransform: "capitalize" }}>{c.categoryId.name}</span>
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
