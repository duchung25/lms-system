import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useMyCourses } from "../hook/useCourse.js";
import '../assets/css/components/card.css';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim(); 

  const { courses, loading: coursesLoading, error } = useMyCourses();
  
  const filteredCourses = useMemo(() => {
    if(!q) return courses;
    return courses.filter((c) =>
      (c.title || "").toLowerCase().includes(q)
    );
  }, [q, courses]);

  if (coursesLoading) {
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
        {courses.length === 0 && !coursesLoading && (
            <div className="text-center text-muted my-5">Không có khóa học nào.</div>
          )}
        {filteredCourses.map((c) => (
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
                <div className="text-muted py-2">Giáo viên: {c.teacherId?.username || "Chưa có thông tin"}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}