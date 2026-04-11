import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function CoursesPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();

  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/courses");
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
  }, []);
  
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