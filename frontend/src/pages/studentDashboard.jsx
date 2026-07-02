import { Link } from "react-router-dom";
import { FiAward, FiCheckCircle, FiClock, FiFileText } from "react-icons/fi";

import { useStudentDashboard } from "../hook/useEnrollment";
import { useMyCertificates } from "../hook/useCertificate";
import RecentNotifications from "../components/notifications/recentNotifications";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function StudentDashboard() {
  const { dashboardData, loading, error } = useStudentDashboard();
  const { certificates, loading: certificatesLoading } = useMyCertificates();

  const overview = dashboardData?.overview || {};
  const recentCertificates = certificates.slice(0, 4);

  return (
    <div className="student-dashboard-page">
      <div className="student-dashboard-header">
        <div>
          <p className="student-dashboard-eyebrow">Học viên</p>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">Đang tải dữ liệu học tập...</div>
      ) : error ? (
        <div className="dashboard-error">{error}</div>
      ) : (
        <>
          <div className="student-kpi-grid">
            <div className="student-kpi-card">
              <FiClock />
              <span>Đang học</span>
              <strong>{overview.activeCourses || 0}</strong>
            </div>
            <div className="student-kpi-card">
              <FiCheckCircle />
              <span>Đã hoàn thành</span>
              <strong>{overview.completedCourses || 0}</strong>
            </div>
            <div className="student-kpi-card">
              <FiAward />
              <span>Chứng chỉ</span>
              <strong>{overview.certificatesEarned || 0}</strong>
            </div>
            <div className="student-kpi-card">
              <FiFileText />
              <span>Tiến độ trung bình</span>
              <strong>{overview.averageProgress || 0}%</strong>
            </div>
          </div>

          <div className="student-dashboard-grid">
            <RecentNotifications />

            <section className="student-dashboard-card">
              <div className="student-dashboard-card-head">
                <h2>Chứng chỉ gần đây</h2>
                <Link to="/certificates">Xem tất cả</Link>
              </div>

              {certificatesLoading ? (
                <div className="text-muted">Đang tải chứng chỉ...</div>
              ) : recentCertificates.length === 0 ? (
                <div className="student-empty-state">
                  Bạn chưa có chứng chỉ nào.
                </div>
              ) : (
                <div className="student-cert-list">
                  {recentCertificates.map((certificate) => (
                    <article className="student-cert-item" key={certificate._id}>
                      <img
                        src={
                          certificate.courseId?.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                        }
                        alt={certificate.courseId?.title || "Certificate"}
                      />

                      <div className="student-cert-content">
                        <h3>{certificate.courseId?.title || "Khóa học"}</h3>
                        <p>
                          Số chứng chỉ: {certificate.certificateNumber}
                        </p>
                        <p>Ngày cấp: {formatDate(certificate.issueDate)}</p>
                        <div className="student-cert-actions">
                          <Link
                            to={certificate.pdfUrl || `/certificates/${certificate._id}/print`}
                            className="btn btn-primary btn-sm"
                          >
                            Xem / In
                          </Link>
                          <Link
                            to={`/certificates/verify?code=${certificate.verificationCode}`}
                            className="btn btn-white btn-sm"
                          >
                            Xác minh
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="student-dashboard-card">
              <div className="student-dashboard-card-head">
                <h2>Gợi ý tiếp theo</h2>
              </div>

              <div className="student-next-step">
                <p>
                  Khi hoàn thành 100% tất cả bài học, hệ thống sẽ tự động cấp chứng chỉ và tạo thông báo cho bạn.
                </p>
                <Link to="/courses/my-courses" className="btn btn-white">
                  Đi tới khóa học của tôi
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
