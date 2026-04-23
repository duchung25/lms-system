import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import { useParams } from "react-router-dom";

export default function LessonDetail() {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `http://localhost:5000/api/courses/${courseId}/lessons`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        const detailData = await detailRes.json();
        const listData = await listRes.json();

        if (!detailRes.ok || !listRes.ok) {
          throw new Error("Failed to fetch data");
        }

        setLesson(detailData.data.lesson);
        setLessons(listData.data.lessons);
      } catch (err) {
        console.error(err);
        setLesson(null);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId && token) {
      fetchData();
    }
  }, [courseId, lessonId, token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" />
      </div>
    );
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
                  onClick={() =>
                    (window.location.href = `/courses/${courseId}/lessons/${l._id}`)
                  }
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
                      Tap to view lesson
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