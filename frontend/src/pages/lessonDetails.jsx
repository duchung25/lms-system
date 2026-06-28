import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUnlockedLessons, useLessonDetail } from "../hook/useLesson.js";
import { useCompleteLesson, useUpdateLearningProgress } from "../hook/useCourse.js";
import { useAuth } from "../auth/useAuth.js";
import CommentSection from "../components/comments/commentSection.jsx";
import { FaCircleCheck, FaLock, FaCirclePlay } from "react-icons/fa6";


export default function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessonAction, setLessonAction] = useState({
    lessonId: null,
    error: "",
    message: "",
    completed: false,
  });

  const {lesson, loading: lessonLoading, error: lessonError} = useLessonDetail(courseId, lessonId);
  const {lessons, loading: lessonsLoading, error: lessonsError, refreshLessons} = useUnlockedLessons(courseId, !!courseId && !!lesson);
  const { updateLearningProgress } = useUpdateLearningProgress();
  const { completeLesson, loading: completing } = useCompleteLesson();
  const loading = lessonsLoading || lessonLoading;
  const error = lessonsError || lessonError;
  const activeLesson = lessons.find((l) => l._id === lessonId);
  const currentLessonAction = lessonAction.lessonId === lessonId ? lessonAction : null;
  const isLessonCompleted = currentLessonAction?.completed || activeLesson?.isCompleted;

  useEffect(() => {
    if (user?.role !== "student" || !courseId || !lessonId || !lesson) return;

    updateLearningProgress(courseId, lessonId).catch(() => {});
  }, [courseId, lessonId, lesson, updateLearningProgress, user?.role]);

  const handleCompleteLesson = async () => {
    if (user?.role !== "student") return;

    try {
      setLessonAction({ lessonId, error: "", message: "", completed: false });
      const result = await completeLesson(courseId, lessonId);
      await refreshLessons();
      setLessonAction({ lessonId, error: "", message: "", completed: true });

      if (result?.nextLessonId) {
        navigate(`/courses/${courseId}/lessons/${result.nextLessonId}`);
        return;
      }

      setLessonAction({
        lessonId,
        error: "",
        message: "Bạn đã hoàn thành khóa học này.",
        completed: true,
      });
    } catch (err) {
      setLessonAction({ lessonId, error: err.message, message: "", completed: false });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (error) {
      return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!lesson) {
    return <div className="alert alert-danger">Lesson not found</div>;
  }

  return (
    <div className="container-fluid lesson-details-wrapper py-3">
      <div className="row g-4">
        {/* Left Column - Video Player, Info, and Comments */}
        <div className="col-12 col-lg-8">
          
          {/* Cinematic Video container */}
          <div className="lesson-video-container">
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl.replace(
                  /watch\?v=/,
                  'embed/'
                )}
                title="lesson video"
                allowFullScreen
                className="w-100 h-100 border-0"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center text-white h-100">
                No video available
              </div>
            )}
          </div>

          {/* Details Content Card */}
          <div className="lesson-content-card">
            <div className="d-flex justify-content-between">
              <div className="lesson-header">
                <h1 className="lesson-title mb-2">{lesson.title}</h1>
                <div className="lesson-meta-date mb-3">
                  Ngày tạo: {new Date(lesson.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>

              {user?.role === "student" && (
                <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center mb-3 justify-content-end">
                  <button
                    className="btn-complete-lesson btn"
                    onClick={handleCompleteLesson}
                    disabled={completing || isLessonCompleted}
                  >
                    {isLessonCompleted ? (
                      <>
                        <FaCircleCheck /> Đã hoàn thành
                      </>
                    ) : completing ? (
                      "Đang lưu..."
                    ) : (
                      "Hoàn thành bài học"
                    )}
                  </button>
                  {currentLessonAction?.message && (
                    <span className="text-success small fw-semibold">
                      {currentLessonAction.message}
                    </span>
                  )}
                  {currentLessonAction?.error && (
                    <span className="text-danger small fw-semibold">
                      {currentLessonAction.error}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="lesson-text-content border-top pt-3">
              {lesson.content || (
                <span className="text-muted italic">Không có mô tả chi tiết cho bài học này.</span>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <CommentSection key={`${courseId}-${lessonId}`} courseId={courseId} lessonId={lessonId} />
          </div>
        </div>

        {/* Right Column - Playlist Lessons Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="lesson-playlist-card">
            <div className="playlist-header">
              <strong>Danh sách bài học</strong>
              <span className="playlist-header-progress">
                Đã học {lessons.filter((l) => l.isCompleted).length}/{lessons.length}
              </span>
            </div>

            <div className="playlist-list-container">
              {lessons.map((l) => {
                const isActive = l._id === lessonId;
                const isLocked = l.isLocked;
                const icon = l.isCompleted ? (
                  <FaCircleCheck className="playlist-item-icon completed" />
                ) : isLocked ? (
                  <FaLock className="playlist-item-icon locked" />
                ) : (
                  <FaCirclePlay className="playlist-item-icon play" />
                );

                return (
                  <button
                    key={l._id}
                    onClick={() => {
                      if (isLocked) return;
                      navigate(`/courses/${courseId}/lessons/${l._id}`);
                    }}
                    disabled={isLocked}
                    className={`playlist-item ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
                  >
                    <div className="playlist-item-content">
                      <span className="playlist-item-icon">{icon}</span>
                      <div className="playlist-item-meta">
                        <span className="playlist-item-title">{l.title}</span>
                        <span className="playlist-item-status-text">
                          {l.isCompleted ? "Đã hoàn thành" : isLocked ? "Đang bị khóa" : "Sẵn sàng học"}
                        </span>
                      </div>
                    </div>
                    <span className="playlist-item-duration">{l.duration || 0} phút</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
