import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiSearch, FiShield, FiXCircle } from "react-icons/fi";

import { useVerifyCertificate } from "../hook/useCertificate";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function CertificateVerifyPage() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const [certificate, setCertificate] = useState(null);
  const { verifyCertificate, loading, error } = useVerifyCertificate();

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const handleVerify = async (value = code) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    try {
      const result = await verifyCertificate(trimmed);
      setCertificate(result);
    } catch {
      setCertificate(null);
    }
  };

  return (
    <div className="certificate-verify-page">
      <div className="certificate-verify-hero">
        <div>
          <p className="certificates-eyebrow">Public Verification</p>
          <h1 className="certificates-title">Xác minh chứng chỉ</h1>
          <p className="certificates-subtitle">
            Nhập mã xác minh để kiểm tra tính hợp lệ của chứng chỉ.
          </p>
        </div>
        <div className="certificate-kpi">
          <FiShield />
          <div>
            <span>Verification</span>
            <strong>Secure</strong>
          </div>
        </div>
      </div>

      <div className="certificate-verify-card">
        <div className="certificate-verify-form">
          <input
            type="text"
            className="certificate-verify-input"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Nhập verification code..."
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleVerify()}
            disabled={loading}
          >
            <FiSearch /> {loading ? "Đang xác minh..." : "Xác minh"}
          </button>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {certificate && (
          <div className={`certificate-verify-result ${certificate.status?.toLowerCase() || "valid"}`}>
            {certificate.status === "REVOKED" ? <FiXCircle /> : <FiCheckCircle />}
            <div>
              <h3>{certificate.status === "REVOKED" ? "Chứng chỉ đã bị thu hồi" : "Chứng chỉ hợp lệ"}</h3>
              <p>
                Học viên: <strong>{certificate.userId?.username || "-"}</strong>
              </p>
              <p>
                Khóa học: <strong>{certificate.courseId?.title || "-"}</strong>
              </p>
              <p>
                Ngày cấp: <strong>{formatDate(certificate.issueDate)}</strong>
              </p>
              <p>
                Số chứng chỉ: <strong>{certificate.certificateNumber}</strong>
              </p>
              <p>
                Trạng thái: <strong>{certificate.status || "VALID"}</strong>
              </p>
              <Link
                to={certificate.pdfUrl || `/certificates/${certificate._id}/print`}
                className="btn btn-white mt-2"
              >
                Xem chứng chỉ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
