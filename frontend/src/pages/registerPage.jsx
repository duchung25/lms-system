import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import RegisterImg from '../assets/img/register_image.jpg';
import '../assets/css/pages/loginPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    if (!payload.username || !payload.email || !payload.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data?.errors?.map((e) => e.message).join(', ') ||
          data?.message ||
          'Đăng ký thất bại';
        throw new Error(detail);
      }

      setMessage(data?.message || 'Đăng ký thành công!');
      setForm({ username: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-6 d-flex flex-column align-items-center">
          <img src={RegisterImg} alt="register-image" className="login-image" />
          <span className="login__note">Chào mừng bạn</span>
          <span>Tạo tài khoản để bắt đầu học tập ngay!</span>
        </div>

        <div className="col-lg-6 d-flex justify-content-center">
          <div className="auth-card w-100">
            <h2 className="mb-3 auth-title">Đăng ký ngay!</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <label htmlFor="username" className="form-label fw-semibold mb-0">
                    Username
                  </label>
                  <small className="text-muted">bắt buộc</small>
                </div>
                <input
                  type="text"
                  className="form-control login__py"
                  id="username"
                  name="username" 
                  placeholder="Nhập username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <label htmlFor="email" className="form-label fw-semibold mb-0">
                    Email
                  </label>
                  <small className="text-muted">bắt buộc</small>
                </div>
                <input
                  type="email"
                  className="form-control login__py"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <label htmlFor="password" className="form-label fw-semibold mb-0">
                    Mật khẩu
                  </label>
                  <small className="text-muted">bắt buộc</small>
                </div>
                <div className="text-muted small mb-2">
                  Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất một ký tự đặc biệt
                </div>
                <input
                  type="password"
                  className="form-control login__py"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-danger mt-2 mb-0">{error}</p>}
              {message && <p className="text-success mt-2 mb-0">{message}</p>}

              <button
                type="submit"
                className="btn w-100 login__py mt-3 auth-submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>

              <p className="small mt-3 mb-0">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="/terms">Điều khoản dịch vụ</a> và{' '}
                <a href="/privacy">Chính sách về quyền riêng tư</a>.
              </p>

              <p className="mt-4 mb-0">
                Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}