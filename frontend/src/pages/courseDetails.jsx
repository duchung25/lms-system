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
import { FiAward } from "react-icons/fi";
import { useMyCertificates, useGenerateCertificate } from "../hook/useCertificate";

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
  const { certificates: studentCertificates, refetch: refetchStudentCerts } = useMyCertificates();
  const { generateCertificate, loading: generatingCert } = useGenerateCertificate();
  const existingCert = studentCertificates?.find(cert => {
    const certCourseId = cert.courseId?._id || cert.courseId;
    return certCourseId?.toString() === courseId?.toString();
  });
  const loading =  deleting || publishing || enrolling || restoring || creatingOrder;
  const progress = lessonProgress || course?.progress || null;

  // BE trả về field `status` ("PUBLISHED" | "DRAFT" | "PENDING_REVIEW" ...), không có field isPublished
  const isPublished = course?.status === "PUBLISHED";

  const handlePublishToggle = async () => {
    let publishedCourse;
    try{
      const action = isPublished ? "unpublish" : "publish";
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
    <div className="course-details-container-wrap">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={setToast.bind(null, null)} />
      )}

      <div className="course-detail-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <span className="course-detail-badge level">{course.level}</span>
                <span className="course-detail-badge category">{course.categoryId?.name}</span>
                {user && user.role === "admin" && (
                  <span className={`course-detail-badge ${isPublished ? "published-status" : "unpublished-status"}`}>
                    {isPublished ? "Công khai" : "Chờ duyệt"}
                  </span>
                )}
              </div>
              <h1 className="course-detail-title mb-3">{course.title}</h1>
              <div className="course-detail-teacher">
                Giảng viên: <strong>{course.teacherId?.username || course.teacherId?.email?.split("@")[0]}</strong> ({course.teacherId?.email})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Columns Section */}
      <div className="container course-details-container mt-4">
        <div className="row g-4">
          
          {/* Left Column (Content & Lessons) */}
          <div className="col-12 col-lg-8">
            
            {/* Description Card */}
            <div className="course-description-section">
              <h2 className="course-description-title">Giới thiệu khóa học</h2>
              <div className="course-description-text">{course.description}</div>
            </div>

            {/* Learning Progress Card (Enrolled student only) */}
            {user?.role === "student" && progress && (
              <div className="student-progress-card">
                <div className="progress-header">
                  <strong>Tiến độ học tập của bạn</strong>
                  <span className="text-muted small">
                    Đã học {progress.completedCount || 0}/{progress.totalLessons || 0} bài học
                  </span>
                </div>
                <div className="progress-track-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.progressPercent || 0}%` }}
                    aria-valuenow={progress.progressPercent || 0}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <div className="progress-footer">
                  <span className="progress-percentage">{progress.progressPercent || 0}% Hoàn thành</span>
                  {progress.isCourseCompleted && <span className="badge bg-success px-3 py-2 rounded-pill">Hoàn thành khóa học</span>}
                </div>
                {progress.isCourseCompleted && (
                  <div className="mt-3 p-3 bg-light rounded d-flex justify-content-between align-items-center border" style={{ borderRadius: "8px" }}>
                    <div>
                      <strong className="d-block text-dark" style={{ fontSize: "0.95rem", fontWeight: "bold" }}>Chứng chỉ khóa học</strong>
                      <span className="text-muted small" style={{ fontSize: "0.85rem" }}>Bạn đã hoàn thành khóa học và đủ điều kiện nhận chứng chỉ.</span>
                    </div>
                    {existingCert ? (
                      <Link
                        to={existingCert.pdfUrl || `/certificates/${existingCert._id}/print`}
                        className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                      >
                        <FiAward /> Xem chứng chỉ
                      </Link>
                    ) : (
                      <button
                        className="btn btn-success btn-sm text-white d-inline-flex align-items-center gap-1"
                        disabled={generatingCert}
                        onClick={async () => {
                          try {
                            await generateCertificate(courseId);
                            setToast({ message: "Nhận chứng chỉ thành công!", type: "success" });
                            if (refetchStudentCerts) refetchStudentCerts();
                          } catch (err) {
                            setToast({ message: err?.message || "Lỗi khi nhận chứng chỉ", type: "error" });
                          }
                        }}
                      >
                        {generatingCert ? "Đang xử lý..." : "Nhận chứng chỉ"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Card (Lessons) */}
            <div className="curriculum-section">
              <div className="curriculum-header">
                <h3 className="curriculum-title">Danh sách bài học</h3>
                {user && user.role !== "teacher" && (
                  <div className="lesson-info-header">
                  <span className="lesson-count">{lessons.length} bài học - {lessons.reduce((acc, lesson) => acc + lesson.duration, 0) + ' giờ'}</span>
                </div> 
                )}
                {user && user.role === "teacher" && (
                  <Link
                    to={`/courses/${courseId}/lessons/new`}
                    className="btn btn-secondary btn-sm"
                  >
                    + Thêm bài học
                  </Link>
                )}
              </div>

              {!lessons || lessons.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">Khóa học này chưa có bài học nào.</p>
              ) : (
                <ul className="curriculum-list">
                  {lessons.map((lesson) => {
                    const isLocked = user?.role === "student" && lesson.isLocked;
                    return (
                      <li
                        key={lesson._id || lesson.order}
                        className={`curriculum-item ${isLocked ? "locked" : ""}`}
                      >
                        {user?.role === "student" ? (
                          <button
                            type="button"
                            className="curriculum-item-btn"
                            disabled={isLocked}
                            onClick={() => {
                              if (isLocked) return;
                              navigate(`/courses/${courseId}/lessons/${lesson._id}`);
                            }}
                          >
                            <div className="curriculum-item-link-content">
                              <span className="curriculum-icon">
                                {lesson.isCompleted ? (
                                  <FaCircleCheck className="curriculum-icon completed" />
                                ) : isLocked ? (
                                  <FaLock className="curriculum-icon locked" />
                                ) : (
                                  <FaCirclePlay className="curriculum-icon active-play" />
                                )}
                              </span>
                              <span>
                                {lesson.order}. {lesson.title}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="curriculum-item-link-content">
                            <span className="curriculum-icon">
                              <FaCirclePlay className="curriculum-icon active-play" />
                            </span>
                            <span>
                              {lesson.order}. {lesson.title}
                            </span>
                          </div>
                        )}
                        <span className="curriculum-duration">{lesson.duration || 0} phút</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column (Floating Sidebar Checkout Card) */}
          <div className="col-12 col-lg-4">
            <div className="course-sidebar-card">
              {course.thumbnail && (
                <div className="sidebar-thumbnail-wrap">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                  />
                </div>
              )}

              <div className="sidebar-card-body">
                <div className={`sidebar-card-price ${course.price === 0 ? "free" : ""}`}>
                  {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString()} VNĐ`}
                </div>
                <div className="sidebar-card-rating">
                  <span className="sidebar-rating-stars">★ {Number(course.averageRating || 0).toFixed(1)}</span>
                  <span>({course.ratingCount || 0} đánh giá)</span>
                </div>

                {user && user.role === "student" ? (
                  enrolledLoading ? null : isEnrolled ? (
                    <Link
                      to={continueLessonId ? `/courses/${courseId}/lessons/${continueLessonId}` : "#"}
                      className={`sidebar-btn-cta secondary w-100 ${!continueLessonId ? "disabled" : ""}`}
                    >
                      Vào học ngay
                    </Link>
                  ) : isPublished ? (
                    <button
                      className="sidebar-btn-cta primary w-100"
                      onClick={handleEnrollCourse}
                      disabled={loading}
                    >
                      {enrolling ? "Đang đăng ký..." : "Đăng ký học"}
                    </button>
                  ) : (
                    <div className="alert alert-warning text-center py-2 mb-0">Khóa học chưa được công khai</div>
                  )
                ) : null}

                <div className="border-top pt-3 mt-3">
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
                </div>

                {/* Admin & Teacher actions */}
                {user && (user.role === "admin" || user.role === "teacher") && (
                  <div className="border-top pt-3 mt-3">
                    <div className="sidebar-action-group">
                      <Link to={`/courses/${courseId}/edit`} className="btn btn-glass-dark btn-sm w-100">
                        Sửa khóa học
                      </Link>
                      <button className="btn btn-danger btn-sm w-100" onClick={handleDeleteCourse}>
                        Xóa khóa học
                      </button>
                    </div>

                    {user.role === "admin" && (
                      <div className="d-flex flex-column gap-2 mt-2">
                        <button
                          className="btn btn-secondary btn-sm w-100"
                          onClick={handlePublishToggle}
                          disabled={loading}
                        >
                          {isPublished ? "Hủy công khai" : "Công khai"}
                        </button>
                        {course.deleted && (
                          <button
                            className="btn btn-success btn-sm w-100 text-white"
                            onClick={handleRestoreCourse}
                          >
                            Khôi phục
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}