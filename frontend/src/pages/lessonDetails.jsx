import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLessons, useLessonDetail } from "../hook/useLesson.js";
import { useCompleteLesson, useUpdateLearningProgress } from "../hook/useCourse.js";
import { useAuth } from "../auth/useAuth.js";


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

  const {lessons, loading: lessonsLoading, error: lessonsError} = useLessons(courseId);
  const {lesson, loading: lessonLoading, error: lessonError} = useLessonDetail(courseId, lessonId);
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
    <div className="container-fluid py-3">
      <div className="row g-3">
      <div className="col-12 col-lg-8">

        <div className="card shadow-sm border-0">
          <div className="ratio ratio-16x9 bg-black">
            {lesson.videoUrl ? (
             <iframe
                src={lesson.videoUrl.replace(
                  /watch\?v=/,
                  'embed/'
                )}
                title="lesson video"
                allowFullScreen
                className="w-100 h-100"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center text-white">
                No video available
              </div>
            )}
          </div>

          <div className="card-body">
            <h3 className="mb-2">{lesson.title}</h3>

            <div className="text-muted small mb-3">
              Created at:{" "}
              {new Date(lesson.createdAt).toLocaleDateString("vi-VN")}
            </div>

            {user?.role === "student" && (
              <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleCompleteLesson}
                  disabled={completing || isLessonCompleted}
                >
                  {isLessonCompleted ? "Đã hoàn thành" : "Hoàn thành bài học"}
                </button>
                {currentLessonAction?.message && <span className="text-success small">{currentLessonAction.message}</span>}
                {currentLessonAction?.error && <span className="text-danger small">{currentLessonAction.error}</span>}
              </div>
            )}

            <hr />

            <div
              style={{
                whiteSpace: "pre-line",
                fontSize: "var(--fs-body)",
                lineHeight: "1.6",
              }}
            >
              {lesson.content || (
                <span className="text-muted">No content available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">

        <div className="card border-0 shadow-sm sticky-top" style={{ top: 16 }}>
          <div className="card-header bg-white border-bottom">
            <strong>Lessons</strong>
          </div>

          <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: "80vh" }}>
            {lessons.map((l) => {
              const isActive = l._id === lessonId;

              return (
                <button
                  key={l._id}
                  onClick={() => {
                    if (l.isLocked) return;
                    navigate(`/courses/${courseId}/lessons/${l._id}`);
                  }}
                  disabled={l.isLocked}
                  className={`list-group-item list-group-item-action border-0 py-3 ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    transition: "all var(--transition-base)",
                  }}
                >
                  <div className="d-flex flex-column">
                    <span className="fw-medium">{l.title}</span>
                    <small className={isActive ? "text-white-50" : "text-muted"}>
                      {l.isCompleted ? "Đã hoàn thành" : l.isLocked ? "Bị khóa" : "Tap to view lesson"}
                    </small>
                  </div>
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
