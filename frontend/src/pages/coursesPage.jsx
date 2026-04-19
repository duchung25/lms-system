import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../auth/useAuth";
import '../assets/css/components/card.css';
import { FaBoxArchive, FaClipboardCheck  } from "../icons";

const LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Programming", label: "Programming" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Business", label: "Business" },
  { value: "Other", label: "Other" },
];

export default function CoursesPage() {
  const { token, user } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();
  const category = params.get("category") || "";
  const level = params.get("level") || "";
  const published = params.get("published") || "";
  const deleted = params.get("deleted") || "";
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(q);
  const [countPendingCourses, setCountPendingCourses] = useState(0);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const query = [
          q ? `q=${encodeURIComponent(q)}` : "",
          category ? `category=${encodeURIComponent(category)}` : "",
          level ? `level=${encodeURIComponent(level)}` : "",
          user.role === "admin" && published ? `published=${published}` : "",
          user.role === "admin" && deleted ? `deleted=${deleted}` : "",
        ].filter(Boolean).join("&");
        const res = await fetch(`http://localhost:5000/api/courses${query ? "?" + query : ""}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCoursesData(Array.isArray(data.data.list) ? data.data.list : []);
        setCountPendingCourses(data.data.list.filter(c => c.isPublished === false).length);
      } catch (error) {
          setCoursesData([]);
          setError("error fetching courses: " + error.message);
      } finally {
          setLoading(false);
      }
    };
    fetchCourses();
    }, [q, category, level, published, deleted, token, user?.role]);
    useEffect(() => {
      if (user && user.role === "admin") {
        const fetchPendingCount = async () => {
          try {
            const res = await fetch("http://localhost:5000/api/courses/count/summary", {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            if (!res.ok) throw new Error("Failed to fetch pending count");
            const data = await res.json();
            setCountPendingCourses(data.data.unpublishedCourses || 0);
          } catch (error) {
            setError("Error fetching pending courses count: " + error.message);
            setCountPendingCourses(0);
          }
        };
        fetchPendingCount();
      }
    }, [ token, user ]);

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
      <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
        <h3 className="m-0">Khóa học</h3>
        {user && user.role === "admin" && (
          <div className="d-flex gap-2">
            <Link to="/courses?deleted=true" className="btn position-relative p-2"
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
            > 
              <FaBoxArchive className="me-1" />
            </Link>
            <Link to="/courses?published=false" className="btn position-relative p-2 btn-hover"
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
            >
              <FaClipboardCheck className="me-1" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{countPendingCourses}</span>
            </Link>
          </div>
        )}
      </div>
      <div className="mb-3 row g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={searchInput}
            placeholder="Tìm kiếm tên khoá học..."
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateFilter("q", e.target.value);
            }}
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
      </div>
      <div className="row g-3">
        {courses.map((c) => (
          <div key={c._id} className="col-12 col-sm-6 col-lg-3">
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
                <div className="text-muted py-2">Giáo viên: {c.teacherId?.email || "Chưa có thông tin"}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}