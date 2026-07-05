import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useChangePassword } from "../hook/useAuth.js";
import { useCreateTeacherRequest, useGetMyTeacherRequest } from "../hook/teacherRq";
import Toast from "../components/toast/toast.jsx";
import { FiArrowLeft, FiLock, FiUserCheck, FiSave, FiSend } from "react-icons/fi";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { changePassword, loading: changePasswordLoading } = useChangePassword();
  const { teacherRequest, loading: requestLoading, refetch: refetchRequest } = useGetMyTeacherRequest();
  const { createTeacherRequest, loading: submitRequestLoading } = useCreateTeacherRequest();

  const [activeTab, setActiveTab] = useState("password");
  const [toast, setToast] = useState(null);

  // Form states for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form state for teacher request
  const [requestMessage, setRequestMessage] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setToast({ type: "error", message: "Vui lòng điền đầy đủ các trường mật khẩu." });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setToast({ type: "error", message: "Mật khẩu mới phải từ 6 ký tự trở lên." });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ type: "error", message: "Mật khẩu xác nhận không khớp." });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setToast({ type: "success", message: "Đổi mật khẩu thành công." });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Đã có lỗi xảy ra khi đổi mật khẩu." });
    }
  };

  const handleTeacherRequestSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    try {
      await createTeacherRequest({ message: requestMessage });
      setToast({ type: "success", message: "Gửi yêu cầu làm giảng viên thành công." });
      setRequestMessage("");
      refetchRequest();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Đã có lỗi xảy ra khi gửi yêu cầu." });
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return { text: "Đang chờ duyệt", class: "pending" };
      case "Approved":
        return { text: "Đã phê duyệt", class: "approved" };
      case "Rejected":
        return { text: "Bị từ chối", class: "rejected" };
      default:
        return { text: "Chưa gửi yêu cầu", class: "" };
    }
  };

  // Check if role is student or if there is a request in history
  const showTeacherRequestTab = user && user.role === "student";

  return (
    <div className="settings-page-container">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header section with back button */}
      <div className="settings-header">
        <button className="settings-back-btn" onClick={() => navigate(-1)} title="Quay lại">
          <FiArrowLeft />
          <span>Quay lại</span>
        </button>
        <div className="settings-title-group">
          <h1>Cài đặt tài khoản</h1>
          <p>Quản lý mật khẩu và các thiết lập tài khoản của bạn</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Internal settings sidebar */}
        <aside className="settings-sidebar">
          <button
            className={`settings-tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <FiLock className="tab-icon" />
            <span>Đổi mật khẩu</span>
          </button>

          {showTeacherRequestTab && (
            <button
              className={`settings-tab-btn ${activeTab === "teacher-request" ? "active" : ""}`}
              onClick={() => setActiveTab("teacher-request")}
            >
              <FiUserCheck className="tab-icon" />
              <span>Đăng ký làm giảng viên</span>
            </button>
          )}
        </aside>

        {/* Content area */}
        <main className="settings-content-area">
          {activeTab === "password" && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Đổi mật khẩu tài khoản</h2>
                <p>Nên sử dụng mật khẩu mạnh và không trùng lặp với các dịch vụ khác.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Xác nhận lại mật khẩu mới"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="settings-submit-btn"
                  disabled={changePasswordLoading}
                >
                  <FiSave className="btn-icon" />
                  <span>{changePasswordLoading ? "Đang lưu..." : "Cập nhật mật khẩu"}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === "teacher-request" && showTeacherRequestTab && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Đăng ký trở thành Giảng viên</h2>
                <p>Gửi yêu cầu nâng cấp tài khoản của bạn để bắt đầu tạo các khóa học thú vị.</p>
              </div>

              {requestLoading ? (
                <div className="settings-loading">Đang tải trạng thái yêu cầu...</div>
              ) : (
                <div className="teacher-request-wrapper">
                  {teacherRequest ? (
                    <div className="request-status-section">
                      <div className="status-banner">
                        <span className="status-label">Trạng thái hiện tại:</span>
                        <span className={`nav-status ${getStatusLabel(teacherRequest.status).class}`}>
                          {getStatusLabel(teacherRequest.status).text}
                        </span>
                      </div>

                      <div className="status-details">
                        <div className="detail-item">
                          <strong>Lời nhắn của bạn:</strong>
                          <p>{teacherRequest.message || "(Không có lời nhắn)"}</p>
                        </div>

                        {teacherRequest.status === "Rejected" && (
                          <div className="detail-item rejected-feedback">
                            <strong>Phản hồi từ Admin:</strong>
                            <p className="admin-message">
                              {teacherRequest.adminMessage || "Yêu cầu của bạn chưa phù hợp vào lúc này."}
                            </p>
                          </div>
                        )}

                        {teacherRequest.status === "Approved" && (
                          <div className="detail-item approved-feedback">
                            <p>Yêu cầu đã được phê duyệt! Hãy tải lại trang hoặc đăng nhập lại để trải nghiệm giao diện Giảng viên.</p>
                          </div>
                        )}
                      </div>

                      {/* If rejected, allow user to resubmit */}
                      {teacherRequest.status === "Rejected" && (
                        <div className="resubmit-section">
                          <hr className="divider" />
                          <h3>Gửi lại yêu cầu mới</h3>
                          <form onSubmit={handleTeacherRequestSubmit} className="settings-form">
                            <div className="form-group">
                              <label htmlFor="resubmitMessage">Giới thiệu bản thân và kinh nghiệm của bạn</label>
                              <textarea
                                id="resubmitMessage"
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                placeholder="Hãy chia sẻ kinh nghiệm giảng dạy hoặc lĩnh vực bạn mong muốn đứng lớp..."
                                rows={4}
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="settings-submit-btn"
                              disabled={submitRequestLoading}
                            >
                              <FiSend className="btn-icon" />
                              <span>{submitRequestLoading ? "Đang gửi..." : "Gửi lại yêu cầu"}</span>
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleTeacherRequestSubmit} className="settings-form">
                      <div className="form-group">
                        <label htmlFor="requestMessage">Giới thiệu bản thân và kinh nghiệm giảng dạy</label>
                        <textarea
                          id="requestMessage"
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          placeholder="Nhập lời giới thiệu, lý do muốn trở thành giảng viên, hoặc đính kèm link CV của bạn..."
                          rows={5}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="settings-submit-btn"
                        disabled={submitRequestLoading}
                      >
                        <FiSend className="btn-icon" />
                        <span>{submitRequestLoading ? "Đang gửi..." : "Gửi yêu cầu nâng cấp"}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
