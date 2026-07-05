import { useState } from "react";
import {
  useApproveTeacherRequest,
  useGetAllTeacherRequests,
  useRejectTeacherRequest,
} from "../hook/teacherRq";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AdminTeacherRequestsPage() {
  const [status, setStatus] = useState("");
  const { teacherRequests, pendingCount, loading, error, refetch } =
    useGetAllTeacherRequests(status);
  const { approveRequest } = useApproveTeacherRequest();
  const { rejectRequest } = useRejectTeacherRequest();

  const handleApprove = async (requestId) => {
    await approveRequest(requestId);
    refetch();
  };

  const handleReject = async (requestId) => {
    const message = window.prompt("Lý do từ chối", "");
    await rejectRequest(requestId, message || "");
    refetch();
  };

  return (
    <div className="nav-feature-page">
      <div className="nav-feature-header">
        <div>
          <p>Admin</p>
          <h1>Teacher Requests</h1>
          <span>{pendingCount} yêu cầu đang chờ duyệt</span>
        </div>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="nav-feature-state">Đang tải yêu cầu...</div>
      ) : error ? (
        <div className="nav-feature-state error">{error}</div>
      ) : teacherRequests.length === 0 ? (
        <div className="nav-feature-state">Chưa có teacher request nào.</div>
      ) : (
        <div className="nav-feature-table">
          <table>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Lời nhắn</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {teacherRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.userId?.username || "-"}</td>
                  <td>{request.userId?.email || "-"}</td>
                  <td>{request.message || "-"}</td>
                  <td>
                    <span className={`nav-status ${request.status?.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    {request.status === "Pending" ? (
                      <div className="nav-row-actions">
                        <button type="button" onClick={() => handleApprove(request._id)}>
                          Duyệt
                        </button>
                        <button type="button" onClick={() => handleReject(request._id)}>
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
