import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page-wrapper d-flex align-items-center justify-content-center">
      {/* 🔴 NHÚNG CSS TRỰC TIẾP VÀO FILE JSX */}
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
          background: radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0,0,0,0) 70%);
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

        /* Responsive mượt mà cho Mobile */
        @media (max-width: 576px) {
          .error-code {
            font-size: 5rem;
          }
          .error-title {
            font-size: 1.4rem;
          }
          .error-actions {
            flex-direction: column-reverse;
            width: 100%;
          }
          .error-actions button {
            width: 100%;
          }
        }
      `}</style>

      {/* GIAO DIỆN HTML */}
      <div className="error-bg-glow"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="glass-card error-card p-5 animate-fade-in-up">
              
              <h1 className="error-code text-gradient animate-float">404</h1>
              
              <div className="error-icon-lock mb-3">
              </div>

              <h2 className="error-title mb-3">Bạn chưa đăng nhập?</h2>
              
              <p className="error-desc mb-4">
                Trang bạn đang tìm kiếm yêu cầu quyền xác thực tài khoản, hoặc phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập để tiếp tục khám phá các khóa học.
              </p>

              <div className="error-actions d-flex justify-content-center gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="btn-outline-glass px-4 py-2"
                >
                  ← Về trang chủ
                </button>

                <button
                  onClick={() => navigate("/auth/login")}
                  className="btn-primary-gradient px-4 py-2"
                >
                  Đăng nhập ngay
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}