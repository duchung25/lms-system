import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="error-page-wrapper d-flex align-items-center justify-content-center">
      <style>{`
        .error-page-wrapper {
          min-height: 100vh;
          position: relative;
          background-color: #0b0f19;
          overflow: hidden;
          color: #ffffff;
        }

        .error-bg-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0,0,0,0) 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        .error-card {
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }

        .error-code {
          font-size: 8rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -2px;
          color: #f87171;
        }

        .error-title {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .error-desc {
          font-size: 1rem;
          line-height: 1.6;
          max-width: 90%;
          margin: 0 auto;
          color: #a0aec0 !important;
        }

        @media (max-width: 576px) {
          .error-code {
            font-size: 5rem;
          }
          .error-title {
            font-size: 1.4rem;
          }
          .error-actions {
            flex-direction: column;
            width: 100%;
          }
          .error-actions button {
            width: 100%;
          }
        }
      `}</style>

      <div className="error-bg-glow"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="glass-card error-card p-5">
              <h1 className="error-code">403</h1>
              <h2 className="error-title mb-3">Không có quyền truy cập</h2>
              <p className="error-desc mb-4">
                Tài khoản của bạn (vai trò: <strong style={{ color: "#c3c0ff" }}>{user?.role || "học viên"}</strong>) không có quyền xem trang này. Vui lòng quay về trang chủ hoặc chuyển đổi tài khoản.
              </p>

              <div className="error-actions d-flex justify-content-center gap-3">
                <button
                  onClick={() => navigate(getDashboardLink())}
                  className="btn btn-outline-light px-4 py-2"
                  style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  Về trang chính của tôi
                </button>

                <button
                  onClick={handleLogout}
                  className="btn btn-danger px-4 py-2"
                  style={{ borderRadius: "8px", backgroundColor: "#ef4444", border: "none" }}
                >
                  Đăng xuất & chuyển tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
