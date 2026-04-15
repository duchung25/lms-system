import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../auth/useAuth";
import '../assets/css/components/card.css';

const LEVEL_OPTIONS = [
  { value: "", label: "Tất cả trình độ" },
  { value: "Beginner", label: "Sơ cấp" },
  { value: "Intermediate", label: "Trung cấp" },
  { value: "Advanced", label: "Nâng cao" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả danh mục" },
  { value: "Programming", label: "Lập trình" },
  { value: "Design", label: "Thiết kế" },
  { value: "Marketing", label: "Marketing" },
  { value: "Business", label: "Kinh doanh" },
  { value: "Other", label: "Khác" },
];

const PUBLISH_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "true", label: "Đã xuất bản" },
  { value: "false", label: "Chưa xuất bản" },
];

export default function CoursesPage() {
  const { token, user } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();
  const category = params.get("category") || "";
  const level = params.get("level") || "";
  const published = params.get("published") || "";

  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const query = [
          q ? `q=${encodeURIComponent(q)}` : "",
          category ? `category=${encodeURIComponent(category)}` : "",
          level ? `level=${encodeURIComponent(level)}` : "",
          user.role === "admin" && published ? `published=${published}` : ""
        ].filter(Boolean).join("&");
        const res = await fetch(`http://localhost:5000/api/courses${query ? "?" + query : ""}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCoursesData(Array.isArray(data.data.list) ? data.data.list : []);
      } catch (error) {
          setCoursesData([]);
          setError("error fetching courses: " + error.message);
      } finally {
          setLoading(false);
      }
    };

    fetchCourses();
  }, [q, category, level, published, token, user?.role]);
  
  const courses = useMemo(() => {
    if(!q) return coursesData;
    return coursesData.filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [q, coursesData]);

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
  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (error) {
    return <div className="text-danger">Lỗi: {error}</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Khóa học</h3>
        {q ? <span className="text-muted">Từ khóa: "{q}"</span> : null}
      </div>
      <div className="mb-3 row g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={q}
            placeholder="Tìm kiếm tên khoá học..."
            onChange={e => updateFilter("q", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={e => updateFilter("category", e.target.value)}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={level}
            onChange={e => updateFilter("level", e.target.value)}
          >
            {LEVEL_OPTIONS.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {user.role === "admin" && (
          <div className="col-md-2">
            <select
              className="form-select"
              value={published}
              onChange={e => updateFilter("published", e.target.value)}
            >
              {PUBLISH_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="row g-3">
        {courses.map((c) => (
          <div key={c.id} className="col-12 col-sm-6 col-lg-3">
            <Link 
              to={`/courses/${c._id}`} 
              className="card h-100 text-decoration-none text-dark course-card"
              style={{ cursor: "pointer" }}
            >
              <div className="card-thumbnail mb-2">
                <img src={c.thumbnail} alt={c.title} />
              </div>
              <div className="card-body">
                <div className="fw-bold">{c.title}</div>
                <div className="text-muted small">{c.level}</div>
                <div className="text-primary fw-bold mt-2">{c.price === 0 ? "Miễn phí" : `${c.price}VNĐ`}</div>
                <div className="text-muted py-2">Giáo viên: {c.teacher?.name || "Chưa có thông tin"}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}