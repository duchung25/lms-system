import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function MyCoursesPage() {
  const { user, token } = useAuth();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();

  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCoursesApiUrl = () => {
    if (user.role === "teacher") {
      return "http://localhost:5000/api/courses/my-courses";
    }
      return "http://localhost:5000/api/enrollments/me";
    };
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(getCoursesApiUrl(), {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await res.json();
        setCoursesData(Array.isArray(data.data.courses) ? data.data.courses : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCoursesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, user?.role]);
  
  const courses = useMemo(() => {
    if(!q) return coursesData;
    return coursesData.filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [q, coursesData]);

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

      <div className="row g-3">
        {user.role === "teacher" && (
          <div className="col-12">
            <Link to="/courses/create" className="btn btn-primary">
              Tạo khóa học mới
            </Link>
          </div>
        )}
        {courses.length === 0 && !loading && (
            <div className="text-center text-muted my-5">Không có khóa học nào.</div>
          )}
        {courses.map((c) => (
          <div key={c.id} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="card__thumb-nail mb-2">
                  <img src={c.thumbnail} alt={c.title} />
                </div>
                <div className="fw-bold">{c.title}</div>
                <div className="text-muted small">{c.level}</div>
                <div className="text-primary fw-bold mt-2">{c.price === 0 ? "Miễn phí" : `${c.price}VNĐ`}</div>
              </div>
              <div className="card-footer bg-white border-0 pt-0">
                <Link className="btn btn-outline-primary w-100" to={`/courses/${c.id}`}>
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}