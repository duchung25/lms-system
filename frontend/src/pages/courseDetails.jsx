import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/toast/toast.jsx";

import { useCourseDetail, useDeleteCourse, useSetPublishCourse , useEnrollCourse, useRestoreCourse } from "../hook/useCourse";
import { useCreateOrder } from "../hook/useOrder";
import { useLessons, useCourseProgress } from "../hook/useLesson";
import { useEnrolledCourses } from "../hook/useCourse";
import RatingWidget from "../components/course/ratingWidget.jsx";
import { FaCircleCheck, FaLock, FaCirclePlay } from "react-icons/fa6";

export default function CourseDetail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [ toast, setToast ] = useState(null);

  const { course, setCourse, loading: courseLoading, error: courseError } = useCourseDetail(courseId);
  const { lessons, loading: lessonsLoading, error: lessonsError } = useLessons(courseId);
  const { deleteCourse, loading: deleting } = useDeleteCourse();
  const { setPublishCourse, loading: publishing } = useSetPublishCourse();
  
  const { enrollCourse, loading: enrolling } = useEnrollCourse();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const { restoreCourse, loading: restoring } = useRestoreCourse();
  const { courses, loading: enrolledLoading } = useEnrolledCourses(user?.role === "student");
  const enrolledCourse = courses?.find(ec => (ec._id || ec.courseId) === courseId);
  const isEnrolled = Boolean(enrolledCourse);
  const firstLessonId = enrolledCourse?.firstLessonId || lessons?.[0]?._id || null;
  const continueLessonId = enrolledCourse?.currentLessonId || firstLessonId;
  const { progress: lessonProgress } = useCourseProgress(courseId, user?.role === "student" && isEnrolled);
  const pageLoading = courseLoading || lessonsLoading || (user?.role === "student" && enrolledLoading);
  const loading =  deleting || publishing || enrolling || restoring || creatingOrder;
  const progress = lessonProgress || course?.progress || null;

  const handlePublishToggle = async () => {
    let publishedCourse;
    try{
      const action = course.isPublished ? "unpublish" : "publish";
      publishedCourse = await setPublishCourse(courseId, action);
      setCourse(publishedCourse);
      setToast({ message: `Course ${action}ed successfully`, type: "success" });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const handleDeleteCourse = async () => {
    try{
      await deleteCourse(courseId);
      user.role === "admin" ? navigate("/admin/courses?deleted=true") : navigate("/courses/my-courses");
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };
  const handleRestoreCourse = async () => {
    try {
      await restoreCourse(courseId);

      navigate("/admin/courses?deleted=true");
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleEnrollCourse = async () => {
    if (user.role !== "student") return;

    try {
      if (course.price <= 0) {
        const data = await enrollCourse(courseId);

        const lessonId =
          data.currentLessonId ||
          data.firstLessonId ||
          firstLessonId;

        if (!lessonId) {
          setToast({
            message: "Khóa học chưa có bài học để vào học",
            type: "error"
          });
          return;
        }
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
        return;
      }
      const order = await createOrder(courseId);
      navigate(`/payment/${order._id}`);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  if (pageLoading) return <div className="text-center mt-5">Loading...</div>;
  if (courseError) {
    return <div className="text-center mt-5"><h3>Error: {courseError}</h3></div>;
  }
  if (lessonsError) {
    return <div className="text-center mt-5"><h3>Error loading lessons: {lessonsError}</h3></div>;
  }
  if(!course) return <div className="text-center mt-5"><h3>Course not found</h3></div>;

  return (
    <div className="container py-4">
      {toast && (
      <Toast message={toast.message} type={toast.type} onClose={setToast.bind(null, null)} />
      )}
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

          {user?.role === "student" && progress && (
            <div className="mb-4 p-3 border rounded bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Course progress</strong>
                <span className="text-muted small">
                  {progress.completedCount || 0}/{progress.totalLessons || 0} lessons
                </span>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress.progressPercent || 0}%` }}
                  aria-valuenow={progress.progressPercent || 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="text-muted small">{progress.progressPercent || 0}% completed</span>
                {progress.isCourseCompleted && <span className="badge bg-success">Completed</span>}
              </div>
            </div>
          )}

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
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      user?.role === "student" && lesson.isLocked ? "opacity-75" : ""
                    }`}
                  >
                    {user?.role === "student" ? (
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none text-start flex-grow-1"
                        disabled={lesson.isLocked}
                        onClick={() => {
                          if (lesson.isLocked) return;
                          navigate(`/courses/${courseId}/lessons/${lesson._id}`);
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {lesson.isCompleted ? (
                            <FaCircleCheck className="text-success" />
                          ) : lesson.isLocked ? (
                            <FaLock className="text-muted" />
                          ) : (
                            <FaCirclePlay className="text-primary" />
                          )}
                          <span>
                            {lesson.order}. {lesson.title}
                          </span>
                        </div>
                      </button>
                    ) : (
                      <span>
                        {lesson.order}. {lesson.title}
                      </span>
                    )}
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
            <div className="text-muted small mb-3">
              {Number(course.averageRating || 0).toFixed(1)} average rating • {course.ratingCount || 0} ratings
            </div>
            {user && user.role === "student" ? (
            enrolledLoading ? null : isEnrolled ? (
              <Link
                to={continueLessonId ? `/courses/${courseId}/lessons/${continueLessonId}` : "#"}
                className={`btn btn-secondary w-100 mt-2 ${!continueLessonId ? "disabled" : ""}`}
              >
                Vào học
              </Link>
              ) : course.isPublished ? (
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={handleEnrollCourse}
                  disabled={loading}
                >
                  {enrolling ? "Processing..." : "Enroll Now"}
                </button>
              ) : null
            ) : null}

            <RatingWidget
              key={`${courseId}-${course.myRating ?? "none"}`}
              courseId={courseId}
              averageRating={course.averageRating || 0}
              ratingCount={course.ratingCount || 0}
              initialRating={course.myRating}
              isEnrolled={isEnrolled}
              onRatingSaved={({ rating, summary }) => {
                setCourse((prev) => prev ? {
                  ...prev,
                  myRating: rating?.rating ?? prev.myRating,
                  averageRating: summary?.averageRating ?? prev.averageRating,
                  ratingCount: summary?.ratingCount ?? prev.ratingCount,
                } : prev);
              }}
            />

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
