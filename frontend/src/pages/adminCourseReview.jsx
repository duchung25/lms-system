import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiSlash,
} from "react-icons/fi";

import Toast from "../components/toast/toast.jsx";
import { useCourses, useReviewCourse } from "../hook/useCourse.js";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const normalizeText = (value = "") => value.toLowerCase().trim();

export default function AdminCourseReview() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);
  const [rejectingCourse, setRejectingCourse] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    courses,
    pendingCount,
    loading,
    error,
  } = useCourses({
    q: "",
    category: "",
    level: "",
    status: "PENDING_REVIEW",
    role: "admin",
    refreshKey,
  });
  console.log(courses)

  const { reviewCourse, loading: reviewing } = useReviewCourse();

  const filteredCourses = useMemo(() => {
    const keyword = normalizeText(search);
    if (!keyword) return courses;

    return courses.filter((course) => {
      const teacherName =
        course.teacherId?.username ||
        course.teacherId?.email ||
        "";
      const categoryName = course.categoryId?.name || "";

      return (
        normalizeText(course.title).includes(keyword) ||
        normalizeText(course.description).includes(keyword) ||
        normalizeText(teacherName).includes(keyword) ||
        normalizeText(categoryName).includes(keyword)
      );
    });
  }, [courses, search]);

  const totalLessons = courses.reduce(
    (sum, course) => sum + (course.totalLessons || 0),
    0
  );

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1);
  };

  const handleApprove = async (courseId) => {
    try {
      await reviewCourse(courseId, { status: "APPROVED" });
      setToast({
        type: "success",
        message: "Đã duyệt và công khai khóa học.",
      });
      handleRefresh();
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const openRejectForm = (course) => {
    setRejectingCourse(course);
    setRejectionReason("");
  };

  const closeRejectForm = () => {
    setRejectingCourse(null);
    setRejectionReason("");
  };

  const handleReject = async (event) => {
    event.preventDefault();

    if (!rejectionReason.trim()) {
      setToast({
        type: "error",
        message: "Vui lòng nhập lý do từ chối.",
      });
      return;
    }

    try {
      await reviewCourse(rejectingCourse._id, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      setToast({
        type: "success",
        message: "Đã từ chối khóa học.",
      });
      closeRejectForm();
      handleRefresh();
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="admin-review-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="admin-review-header">
        <div>
          <h1>Duyệt khóa học</h1>
          <p>Danh sách khóa học giảng viên đã gửi và đang chờ admin phản hồi.</p>
        </div>

        <div className="admin-review-header-actions">
          <div className="admin-review-header-links">
            <Link to="/admin/dashboard" className="btn btn-white btn-sm">
              <FiArrowLeft />
              Bảng điều khiển
            </Link>
            <Link to="/admin/courses" className="btn btn-white btn-sm">
              Xem tất cả khóa học
            </Link>
          </div>
          <button
            type="button"
            className="btn btn-white admin-review-refresh"
            onClick={handleRefresh}
            disabled={loading || reviewing}
          >
            <FiRefreshCw />
            Làm mới
          </button>
        </div>
      </div>

      <div className="admin-review-stats">
        <div className="admin-review-stat">
          <span>Đang chờ duyệt</span>
          <strong>{pendingCount || courses.length}</strong>
        </div>
        <div className="admin-review-stat">
          <span>Trong danh sách</span>
          <strong>{filteredCourses.length}</strong>
        </div>
        <div className="admin-review-stat">
          <span>Tổng bài học</span>
          <strong>{totalLessons}</strong>
        </div>
      </div>

      <div className="admin-review-toolbar">
        <FiSearch />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo tên khóa học, giảng viên hoặc danh mục..."
        />
      </div>

      {error ? (
        <div className="admin-review-message error">{error}</div>
      ) : loading ? (
        <div className="admin-review-message">Đang tải khóa học chờ duyệt...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="admin-review-empty">
          <FiClock />
          <h3>Không có khóa học nào đang chờ duyệt</h3>
          <p>Khi giảng viên gửi khóa học, danh sách sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="admin-review-list">
          {filteredCourses.map((course) => {
            const teacherName =
              course.teacherId?.username ||
              course.teacherId?.email?.split("@")[0] ||
              "Giảng viên";
            const categoryName = course.categoryId?.name || "Chưa phân loại";

            return (
              <article className="admin-review-card" key={course._id}>
                <div className="admin-review-thumb">
                  <img
                    src={
                      course.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                    }
                    alt={course.title}
                  />
                </div>

                <div className="admin-review-content">
                  <div className="admin-review-card-head">
                    <div>
                      <span className="admin-review-status">PENDING_REVIEW</span>
                      <h2>{course.title}</h2>
                    </div>
                    <span className="admin-review-date">
                      Gửi duyệt: {formatDate(course.submittedAt)}
                    </span>
                  </div>

                  <p className="admin-review-description">
                    {course.description || "Khóa học chưa có mô tả."}
                  </p>

                  <div className="admin-review-meta">
                    <span>GV: {teacherName}</span>
                    <span>{categoryName}</span>
                    <span>{course.level}</span>
                    <span>{course.totalLessons || 0} bài học</span>
                    <span>
                      {course.price === 0
                        ? "Miễn phí"
                        : `${Number(course.price || 0).toLocaleString()} VNĐ`}
                    </span>
                  </div>

                  <div className="admin-review-actions">
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-white btn-sm"
                    >
                      <FiEye />
                      Xem chi tiết
                    </Link>
                    <button
                      type="button"
                      className="btn btn-success btn-sm text-white"
                      onClick={() => handleApprove(course._id)}
                      disabled={reviewing}
                    >
                      <FiCheckCircle />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openRejectForm(course)}
                      disabled={reviewing}
                    >
                      <FiSlash />
                      Từ chối
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {rejectingCourse && (
        <div className="admin-review-modal-backdrop">
          <form className="admin-review-modal" onSubmit={handleReject}>
            <h3>Từ chối khóa học</h3>
            <p>{rejectingCourse.title}</p>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              rows={5}
              placeholder="Nhập lý do để giảng viên chỉnh sửa..."
              autoFocus
            />
            <div className="admin-review-modal-actions">
              <button
                type="button"
                className="btn btn-white"
                onClick={closeRejectForm}
                disabled={reviewing}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={reviewing}
              >
                Xác nhận từ chối
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
