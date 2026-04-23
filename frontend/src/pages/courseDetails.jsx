import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate, Link } from "react-router-dom";

export default function CourseDetail() {
  const { user, token } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const urls = [
          `http://localhost:5000/api/courses/${courseId}`,
          `http://localhost:5000/api/courses/${courseId}/lessons`
        ];

        const responses = await Promise.all(
          urls.map(url =>
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          )
        );
        const [courseRes, lessonsRes] = await Promise.all(
          responses.map(res => res.json())
        );
        if (!responses[0].ok) throw new Error(courseRes.message);
        if (!responses[1].ok) throw new Error(lessonsRes.message);
        console.log("courseRes:", courseRes);
        setCourse(courseRes.data.course);
        setLessons(lessonsRes.data.lessons);
        

      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
        navigate("/admin/courses");
      })
      .catch(() => alert("Failed to delete course"));
  };
  function handleRestoreCourse() {
    fetch(`http://localhost:5000/api/courses/${courseId}/restore`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      }    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        navigate("/admin/courses?deleted=true");
      })
      .catch(() => alert("Failed to restore course"));
  };
  async function handleEnrollCourse() {
    if(user.role !== "student"){
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${courseId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message );
      }
      if (data.data.firstLessonId) {
        navigate(`/courses/${courseId}/lessons/${data.data.firstLessonId}`);
      } else {
        alert("Enrolled successfully, but no lessons available yet");
      }

    } catch (error) {
      alert("Failed to enroll in course: " + error.message);
    }
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!course) return <div className="text-center mt-5">Course not found</div>;

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-8 mb-3 mb-md-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <div>
              <h2 className="fw-bold text-feature-title mb-2">{course.title}</h2>
              <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                <span className="badge bg-primary">{course.level}</span>
                <span className="badge bg-secondary">{course.category}</span>
                {user && user.role === "admin" && (
                  <span className={`badge ${course.isPublished ? "bg-success" : "bg-danger"}`}>
                    {course.isPublished ? "Published" : "Unpublished"}
                  </span>
                )}
              </div>
              <div className="mt-1 mb-2 text-body-lg">
                <span className="fw-medium">Teacher:</span>{" "}
                {course.teacherId?.username} ({course.teacherId?.email})
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {user && user.role === "admin" && (
                <button
                  className={`btn btn-glass-dark btn-sm`}
                  onClick={handlePublishToggle}
                  value={courseId}
                >
                  {course.isPublished ? "Unpublish" : "Publish"}
                </button>
              )}
              {user && user.role === "admin" && course.deleted && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleRestoreCourse}
                  value={courseId}
                >
                  Restore
                </button>
              )}
            </div>
          </div>

          <p className="text-body">{course.description}</p>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 text-subheading">Danh sách bài học</h4>
              {(user && ( user.role === "teacher")) && (
                <Link
                  to={`/courses/${courseId}/lessons/new`}
                  className="btn btn-secondary btn-sm"
                >
                  + Thêm bài học
                </Link>
              )}
            </div>
            {!lessons || lessons.length === 0 ? (
              <p className="text-body-light mb-0">Chưa có bài học</p>
            ) : (
              <ul className="list-group">
                {lessons.map((lesson) => (
                  <li
                    key={lesson._id || lesson.order}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {lesson.order}. {lesson.title}
                    </span>
                    <span className="text-muted">{lesson.duration} phút</span>
                  </li>
                ))}
              </ul>
            )}
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

          <div className="border p-3 rounded bg-white shadow-sm">
            <h4 className="text-success text-feature-title mb-2">
              {course.price === 0 ? "Free" : `${course.price} VND`}
            </h4>
            {user && user.role === "student" ? (
            course.isEnrolled ? (
              <Link
                to={`/courses/${courseId}/lessons/${course.firstLessonId}`}
                className="btn btn-secondary w-100 mt-2"
              >
                Vào học
              </Link>
              ) : course.isPublished ? (
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={handleEnrollCourse}
                >
                  Enroll Now
                </button>
              ) : null
            ) : null}
            {(user && (user.role === "admin" || user.role === "teacher")) && (
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Link to={`/courses/${courseId}/edit`} className="btn btn-glass-dark btn-sm">
                  Edit Course
                </Link>
                <button className="btn btn-glass-dark btn-sm" onClick={handleDeleteCourse}>
                  Delete Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}