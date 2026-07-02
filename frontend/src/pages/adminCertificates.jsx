import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiSearch, FiSlash, FiPrinter } from "react-icons/fi";

import { useAllCertificates, useRevokeCertificate } from "../hook/useCertificate";
import Toast from "../components/toast/toast.jsx";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AdminCertificatesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const { certificates, pagination, loading, error, refetch } = useAllCertificates();
  const { revokeCertificate, loading: revoking } = useRevokeCertificate();

  useEffect(() => {
    refetch({ search, page, limit: 10 });
  }, [search, page, refetch]);

  const totalValid = useMemo(
    () => certificates.filter((certificate) => certificate.status === "VALID").length,
    [certificates]
  );

  const handleRefresh = () => {
    refetch({ search, page, limit: 10 });
  };

  const handleRevoke = async (certificateId) => {
    try {
      await revokeCertificate(certificateId);
      setToast({ type: "success", message: "Đã thu hồi chứng chỉ." });
      handleRefresh();
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="admin-certificates-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="certificates-page-header">
        <div>
          <p className="certificates-eyebrow">Admin</p>
          <h1 className="certificates-title">Quản lý chứng chỉ</h1>
          <p className="certificates-subtitle">
            Tìm kiếm, kiểm tra và thu hồi chứng chỉ khi cần.
          </p>
        </div>

        <div className="certificate-kpi">
          <FiPrinter />
          <div>
            <span>Hợp lệ</span>
            <strong>{totalValid}</strong>
          </div>
        </div>
      </div>

      <div className="admin-certificates-toolbar">
        <div className="admin-certificates-search">
          <FiSearch />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo mã, tên học viên, khóa học..."
          />
        </div>

        <button type="button" className="btn btn-white" onClick={handleRefresh} disabled={loading || revoking}>
          <FiRefreshCw /> Làm mới
        </button>
      </div>

      {error ? (
        <div className="dashboard-error">{error}</div>
      ) : loading ? (
        <div className="dashboard-loading">Đang tải chứng chỉ...</div>
      ) : (
        <>
          <div className="certificate-grid admin-grid">
            {certificates.length === 0 ? (
              <div className="certificate-empty">
                <h3>Không có chứng chỉ nào</h3>
              </div>
            ) : (
              certificates.map((certificate) => (
                <article className="certificate-card" key={certificate._id}>
                  <div className="certificate-card-body">
                    <div className="certificate-card-topline">
                      <span className={`certificate-status ${certificate.status?.toLowerCase() || "valid"}`}>
                        {certificate.status || "VALID"}
                      </span>
                      <span>{formatDate(certificate.issueDate)}</span>
                    </div>

                    <h3>{certificate.courseId?.title || "Khóa học"}</h3>
                    <p>Học viên: {certificate.userId?.username || "-"}</p>
                    <p>Email: {certificate.userId?.email || "-"}</p>
                    <p>Mã chứng chỉ: {certificate.certificateNumber}</p>

                    <div className="certificate-card-actions">
                      <Link to={certificate.pdfUrl || `/certificates/${certificate._id}/print`} className="btn btn-primary btn-sm">
                        <FiPrinter /> Xem
                      </Link>
                      <Link to={`/certificates/verify?code=${certificate.verificationCode}`} className="btn btn-white btn-sm">
                        Xác minh
                      </Link>
                      {certificate.status !== "REVOKED" && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRevoke(certificate._id)}
                          disabled={revoking}
                        >
                          <FiSlash /> Thu hồi
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button className="btn btn-white" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>
                Trang trước
              </button>
              <span>
                Trang {page} / {pagination.totalPages}
              </span>
              <button className="btn btn-white" onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} disabled={page >= pagination.totalPages}>
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
