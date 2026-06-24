import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function LessonForm() {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isUpdateMode = !!lessonId;
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1,
    duration: 0,
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUpdateMode && courseId && lessonId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}`)
        .then(res => res.json())
        .then(data => {
          setForm(data.data.lesson);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [courseId, lessonId, isUpdateMode]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function getYoutubeEmbed(url) {
    const reg = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(reg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, courseId };
    const url = isUpdateMode
      ? `http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}`
      : `http://localhost:5000/api/courses/${courseId}/lessons`;
    const method = isUpdateMode ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      await res.json();
      alert(isUpdateMode ? "Cập nhật bài học thành công!" : "Tạo bài học thành công!");
      navigate(`/courses/${courseId}`);
    } catch (err) {
      alert("Lỗi xử lý: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-4"><h3>Loading...</h3></div>;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">{isUpdateMode ? "Chỉnh sửa bài học" : "Thêm bài học mới"}</h3>
      </div>
      <form className="row g-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Tên bài học</label>
            <input
              type="text"
              className="form-control"
              name="title"
              maxLength={100}
              value={form.title}
              onChange={handleChange}
              required
            />
            <div className="form-text">Không quá 100 ký tự.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Nội dung mô tả</label>
            <textarea
              className="form-control"
              name="content"
              maxLength={250}
              rows={3}
              value={form.content}
              onChange={handleChange}
              placeholder="Mô tả (có thể để trống)"
            />
            <div className="form-text">Không quá 250 ký tự.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Thứ tự</label>
            <input
              type="number"
              className="form-control"
              name="order"
              min={1}
              value={form.order}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Thời lượng (phút)</label>
            <input
              type="number"
              className="form-control"
              name="duration"
              min={0}
              value={form.duration}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              id="isPublished"
            />
            <label className="form-check-label" htmlFor="isPublished">
              Công khai bài học này
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Link video YouTube</label>
            <input
              type="text"
              className="form-control"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Dán link YouTube (hoặc để trống)"
            />
          </div>
          <div className="thumbnail-upload-box">
            {getYoutubeEmbed(form.videoUrl) ? (
              <iframe
                className="rounded w-100"
                height="240"
                src={getYoutubeEmbed(form.videoUrl)}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video preview"
              />
            ) : (
              <div className="video-placeholder bg-light d-flex align-items-center justify-content-center rounded" style={{ height: 180 }}>
                <span className="text-muted">No video preview</span>
              </div>
            )}
          </div>
          <div className="form-text mt-2">
            Chỉ cần dán link YouTube, hệ thống sẽ tự nhúng video.
          </div>
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {isUpdateMode ? "Cập nhật bài học" : "Tạo bài học"}
          </button>
        </div>
      </form>
    </div>
  );
}