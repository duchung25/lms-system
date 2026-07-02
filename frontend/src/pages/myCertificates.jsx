import { useState } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiDownload, FiPrinter, FiShield } from "react-icons/fi";

import { useMyCertificates, useGenerateCertificate } from "../hook/useCertificate";
import { useEnrolledCourses } from "../hook/useCourse";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function MyCertificatesPage() {
  const { certificates, loading, error, refetch: refetchCerts } = useMyCertificates();
  const { courses: enrolledCourses, loading: enrolledLoading } = useEnrolledCourses(true);
  const { generateCertificate, loading: generating } = useGenerateCertificate();
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState("");

  const total = certificates.length;

  const completedCoursesWithoutCert = enrolledCourses.filter(course => {
    const isCompleted = course.progressPercent === 100;
    const hasCert = certificates.some(cert => {
      const certCourseId = cert.courseId?._id || cert.courseId;
      const targetCourseId = course._id || course.courseId;
      return certCourseId?.toString() === targetCourseId?.toString();
    });
    return isCompleted && !hasCert;
  });

  return (
    <div className="certificates-page">
      <div className="certificates-page-header">
        <div>
          <p className="certificates-eyebrow">Học viên</p>
          <h1 className="certificates-title">Chứng chỉ của tôi</h1>
          <p className="certificates-subtitle">
            Xem, in và xác minh tất cả chứng chỉ bạn đã nhận.
          </p>
        </div>

        <div className="certificate-kpi">
          <FiAward />
          <div>
            <span>Tổng chứng chỉ</span>
            <strong>{total}</strong>
          </div>
        </div>
      </div>

      {completedCoursesWithoutCert.length > 0 && (
        <div className="completed-no-cert-section mb-4 p-4 border rounded" style={{ background: "rgba(79, 70, 229, 0.05)", borderColor: "#4f46e5", borderRadius: "8px" }}>
          <h3 className="d-flex align-items-center gap-2 mb-2" style={{ color: "#4f46e5", fontSize: "1.2rem", fontWeight: "bold" }}>
            <FiAward /> Khóa học đã hoàn thành nhưng chưa nhận chứng chỉ
          </h3>
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>Bạn đã hoàn thành 100% các khóa học dưới đây. Hãy bấm nút "Nhận chứng chỉ" để hệ thống cập nhật và cấp chứng chỉ chính thức.</p>
          {claimError && <div className="alert alert-danger py-2 mb-3">{claimError}</div>}
          {claimSuccess && <div className="alert alert-success py-2 mb-3">{claimSuccess}</div>}
          <div className="d-flex flex-column gap-2">
            {completedCoursesWithoutCert.map(course => (
              <div key={course._id} className="d-flex justify-content-between align-items-center p-3 bg-white rounded shadow-sm border" style={{ borderRadius: "6px" }}>
                <div className="d-flex align-items-center gap-3">
                  <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100"} alt={course.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }} />
                  <div>
                    <h4 className="m-0 h6 font-weight-bold" style={{ margin: 0, fontSize: "0.95rem" }}>{course.title}</h4>
                    <span className="text-success small fw-semibold">Tiến độ: 100%</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={generating}
                  style={{ whiteSpace: "nowrap" }}
                  onClick={async () => {
                    try {
                      setClaimError("");
                      setClaimSuccess("");
                      await generateCertificate(course._id || course.courseId);
                      setClaimSuccess(`Chúc mừng! Bạn đã nhận chứng chỉ cho khóa học "${course.title}".`);
                      if (refetchCerts) refetchCerts();
                    } catch (err) {
                      setClaimError(err.message || "Không thể nhận chứng chỉ. Vui lòng thử lại.");
                    }
                  }}
                >
                  {generating ? "Đang xử lý..." : "Nhận chứng chỉ"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {loading ? (
        <div className="dashboard-loading">Đang tải chứng chỉ...</div>
      ) : error ? (
        <div className="dashboard-error">{error}</div>
      ) : certificates.length === 0 ? (
        <div className="certificate-empty">
          <FiShield />
          <h3>Bạn chưa có chứng chỉ nào</h3>
          <p>Hoàn thành 100% khóa học để hệ thống tự động cấp chứng chỉ.</p>
          <Link to="/courses" className="btn btn-primary">
            Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="certificate-grid">
          {certificates.map((certificate) => (
            <article className="certificate-card" key={certificate._id}>
              <div className="certificate-card-media">
                <img
                  src={
                    certificate.courseId?.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                  }
                  alt={certificate.courseId?.title || "Certificate"}
                />
              </div>

              <div className="certificate-card-body">
                <div className="certificate-card-topline">
                  <span className={`certificate-status ${certificate.status?.toLowerCase() || "valid"}`}>
                    {certificate.status || "VALID"}
                  </span>
                  <span>{formatDate(certificate.issueDate)}</span>
                </div>

                <h3>{certificate.courseId?.title || "Khóa học"}</h3>
                <p>Số chứng chỉ: {certificate.certificateNumber}</p>
                <p>Mã xác minh: {certificate.verificationCode}</p>

                <div className="certificate-card-actions">
                  <Link
                    to={certificate.pdfUrl || `/certificates/${certificate._id}/print`}
                    className="btn btn-primary btn-sm"
                  >
                    <FiPrinter /> In / Tải
                  </Link>
                  <Link
                    to={`/certificates/verify?code=${certificate.verificationCode}`}
                    className="btn btn-white btn-sm"
                  >
                    <FiDownload /> Xác minh
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
