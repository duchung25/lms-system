import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterImg from '../assets/img/register_image.jpg';
import { useRegister } from '../hook/useAuth.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const [ validationError, setValidationError ] = useState("");
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    if (!payload.username || !payload.email || !payload.password) {
      setValidationError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    try{
      await register(payload);
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container login-page">
      <div className="row h-100">
        <div className="d-none d-lg-flex col-lg-6 login-left flex-column justify-content-center align-items-center text-center">
          <img src={RegisterImg} alt="Register" className="login-left__img" />
          <div className="login-left__content">
            <p className="login-left__note">Chào mừng bạn</p>
            <p className="login-left__text">
              Tạo tài khoản để bắt đầu học tập ngay!
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center login-form">
          <div className="login-form__container">
            <div className="login-header text-center text-lg-start">
              <div className="login-logo justify-content-center justify-content-lg-start">
                <div className="login-logo__icon">🎓</div>
                <span className="login-logo__text">StudyHub</span>
              </div>
              <h2 className="login-title">Đăng ký ngay!</h2>
              <p className="login-subtitle">
                Trở thành học viên của cộng đồng ngay hôm nay
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="login-label">Username</label>
                <input
                  type="text"
                  className="login-input"
                  name="username"
                  placeholder="Nhập username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="login-label">Email</label>
                <input
                  type="email"
                  className="login-input"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="login-label">Mật khẩu</label>
                <input
                  type="password"
                  className="login-input"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <p className="text-muted small mt-1" style={{ fontSize: '12px' }}>
                  Ít nhất 8 ký tự, có ký tự đặc biệt
                </p>
              </div>
              {validationError
                ? <p className="text-danger mb-2">{validationError}</p>
                : error && <p className="text-danger mb-2">{error}</p>
              }
              <button
                type="submit"
                className="login-submit mt-2"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
              <div className="login-footer">
                <p className="small mb-3">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <a href="/terms" className="login-link">Điều khoản</a> và{' '}
                  <a href="/privacy" className="login-link">Bảo mật</a>.
                </p>
                <p>
                  Bạn đã có tài khoản?{' '}
                  <a href="/auth/login" className="login-link">Đăng nhập ngay</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}