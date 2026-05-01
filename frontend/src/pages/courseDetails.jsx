import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate, Link } from "react-router-dom";

import { useCourseDetail, useDeleteCourse, usePublishCourse, useUnpublishCourse, useEnrollCourse, useRestoreCourse } from "../hook/useCourse";
import { useLessons } from "../hook/useLesson";

export default function CourseDetail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [ error, setError ] = useState("");

  const { course, setCourse, loading: courseLoading } = useCourseDetail(courseId);
  const { lessons, loading: lessonsLoading } = useLessons(courseId);
  const { deleteCourse, loading: deleting } = useDeleteCourse();
  const { publishCourse, loading: publishing } = usePublishCourse();
  const { unpublishCourse, loading: unpublishing } = useUnpublishCourse();
  const { enrollCourse, loading: enrolling } = useEnrollCourse();
  const { restoreCourse, loading: restoring } = useRestoreCourse();

  const pageLoading = courseLoading || lessonsLoading;
  const loading =  deleting || publishing || unpublishing || enrolling || restoring;

  const handlePublishToggle = async () => {
    let publishedCourse;
    try{
      const action = course.isPublished ? "unpublish" : "publish";
      if(action === "publish") {
          publishedCourse = await publishCourse(courseId);
        }
      else {
        publishedCourse = await unpublishCourse(courseId);
      }
      setCourse(publishedCourse);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteCourse = async () => {
    try{
      await deleteCourse(courseId);
      navigate(user.role === "admin" ? "/admin/courses" : "/courses/my-courses");
    } catch (error) {
      setError(error.message);
    }
  };
  const handleRestoreCourse = async () => {
    try {
      await restoreCourse(courseId);

      navigate("/admin/courses?deleted=true");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnrollCourse = async () => {
    if (user.role !== "student") return;

    try {
      const data = await enrollCourse(courseId);
      console.log("Enrollment successful:", data);
      if (data.firstLessonId) {
        navigate(
          `/courses/${courseId}/lessons/${data.firstLessonId}`
        );
      } else {
        alert("Enrolled successfully, but no lessons available yet");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (pageLoading) return <div className="text-center mt-5">Loading...</div>;
  if (!course) return <div className="text-center mt-5">Course not found</div>;
  {error && (
      <div className="alert alert-danger">{error}
      </div>
  )};

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
                  disabled={loading}
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