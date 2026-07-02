import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPrinter, FiShield, FiArrowLeft } from "react-icons/fi";

import { useCertificateDetail } from "../hook/useCertificate";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function CertificatePrintPage() {
  const { certificateId } = useParams();
  const { certificate, loading, error } = useCertificateDetail(certificateId);

  useEffect(() => {
    document.title = "Certificate Preview";
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Đang tải chứng chỉ...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!certificate) {
    return <div className="dashboard-error">Certificate not found</div>;
  }

  return (
    <div className="certificate-print-page">
      <div className="certificate-print-toolbar no-print">
        <Link to="/certificates" className="btn btn-white">
          <FiArrowLeft /> Quay lại
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          <FiPrinter /> In / Lưu PDF
        </button>
      </div>

      <section className="certificate-print-sheet">
        <div className="certificate-print-badge">
          <FiShield />
          Chứng chỉ hoàn thành khóa học
        </div>

        <h1>{certificate.courseId?.title || "Khóa học"}</h1>
        <p className="certificate-print-subtitle">
          Xác nhận rằng <strong>{certificate.userId?.username || "Học viên"}</strong> đã hoàn thành toàn bộ nội dung khóa học.
        </p>

        <div className="certificate-print-meta">
          <div>
            <span>Số chứng chỉ</span>
            <strong>{certificate.certificateNumber}</strong>
          </div>
          <div>
            <span>Mã xác minh</span>
            <strong>{certificate.verificationCode}</strong>
          </div>
          <div>
            <span>Ngày cấp</span>
            <strong>{formatDate(certificate.issueDate)}</strong>
          </div>
          <div>
            <span>Trạng thái</span>
            <strong>{certificate.status || "VALID"}</strong>
          </div>
        </div>

        <div className="certificate-print-footer">
          <div>
            <span>Người học</span>
            <strong>{certificate.userId?.username || "-"}</strong>
          </div>
          <div>
            <span>Khóa học</span>
            <strong>{certificate.courseId?.title || "-"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
