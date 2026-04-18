import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate, Link } from "react-router-dom";

export default function CourseDetail() {
  const { user, token } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${courseId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
       }
    )
      .then(res => res.json())
      .then(data => {
        setCourse(data.data.course);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, token]);
  function handlePublishToggle() {
    const action = course.isPublished ? "unpublish" : "publish";
    fetch(`http://localhost:5000/api/courses/${courseId}/${action}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCourse(data.data.course);
      });
  };
  function handleDeleteCourse() {
    fetch(`http://localhost:5000/api/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setCourse(null);
        navigate("/my-courses");
      })
      .catch(() => alert("Failed to delete course"));
  }


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!course) return <div className="text-center mt-5">Course not found</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        {user && user.role === "admin" && (
          <div className="mb-3">
            <button className={`btn btn-sm ms-3 ${course.isPublished ? "btn-warning" : "btn-success"}`} onClick={handlePublishToggle} value={courseId}>
              {course.isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        )}
      </div>
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="fw-bold">{course.title}</h2>
          <p className="text-muted">{course.description}</p>

          <div className="d-flex gap-3 mt-3">
            <span className="badge bg-primary">{course.level}</span>
            <span className="badge bg-secondary">{course.category}</span>
            {user && user.role === "admin" && (
              <span className={`badge ${course.isPublished ? "bg-success" : "bg-danger"}`}>
                {course.isPublished ? "Published" : "Unpublished"}
              </span>
            )}
          </div>

          <div className="mt-3">
            <strong>Teacher:</strong>{" "}
            {course.teacherId?.username} ({course.teacherId?.email})
          </div>
        </div>

        <div className="col-md-4">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt="thumbnail"
              className="img-fluid rounded mb-3"
            />
          )}

          <div className="border p-3 rounded">
            <h4 className="text-success">
              {course.price === 0 ? "Free" : `${course.price} VND`}
            </h4>
            { user && user.role === "student" && (
              <button className="btn btn-primary w-100 mt-2">
                Enroll Now
              </button>
            )}
              <div className="management_btn d-flex justify-content-center gap-2 mt-3 flex-1">
                {user && (user.role === "admin" || user.role === "teacher") && (
                  <>
                    <Link to={`/courses/${courseId}/edit`} className="btn btn-sm btn-info">
                      Edit Course
                    </Link>
                  </>
                )}
                {user && (user.role === "admin" || user.role === "teacher") && (
                  <button className="btn btn-sm btn-danger" onClick={handleDeleteCourse}>
                    Delete Course
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {course.lessons?.length === 0 ? (
        <p>Chưa có bài học</p>
      ) : (
        
            <div>
              <h4 className="mb-3">Danh sách bài học</h4>

              {!course.lessons || course.lessons.length === 0 ? (
                <p>Chưa có bài học</p>
              ) : (
                    <ul className="list-group">
                      {course.lessons.map((lesson) => (
                        <li
                          key={lesson._id || lesson.order}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {lesson.order}. {lesson.title}
                          </span>
                          <span className="text-muted">
                            {lesson.duration} phút
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
        )}
    </div>
  );
}