import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

import LoginImg from '../assets/img/login_image.jpg';
import '../assets/css/pages/loginPage.css';
import { FaGoogle, FaFacebookF } from '../icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      email: form.email.trim(),
      password: form.password,
    };

    if (!payload.email || !payload.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data?.errors?.map((e) => e.message).join(', ') ||
          data?.message ||
          'Đăng nhập thất bại';
        throw new Error(detail);
      }
      auth.login({
        accessToken: data.data.token,
        user: data.data.user,
      })

      if (data.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      } catch (err) {
        setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-6 d-flex flex-column align-items-center">
          <img src={LoginImg} alt="login-image" className="login-image" />
          <span className="login__note">Bạn có biết</span>
          <span>Học tập là chìa khóa thành công?</span>
        </div>
        <div className="col-lg-6 d-flex justify-content-center">
          <div className="auth-card w-100">
            <h2 className="mb-3 auth-title">Đăng nhập ngay!</h2>

            <button type="button" className=" login__btn">
              <FaGoogle />
              <span>Tiếp tục bằng Google</span>
            </button>

            <div className="row g-3 mt-1">
              <div className="col-12">
                <button type="button" className=" login__btn">
                  <FaFacebookF />
                  <span>Tiếp tục bằng Facebook</span>
                </button>
              </div>
            </div>

            <div className="divider my-4">
              <span>Hoặc đăng nhập bằng tài khoản</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <label htmlFor="email" className="form-label fw-semibold mb-0">Email</label>
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
                  <label htmlFor="password" className="form-label fw-semibold mb-0">Mật khẩu</label>
                  <small className="text-muted">bắt buộc</small>
                </div>
                <input
                  type="password"
                  className="form-control login__py"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-danger mt-2 mb-0">{error}</p>}

              <a className="d-inline-block mt-2" href="/forgot-password">
                Quên mật khẩu?
              </a>

              <button
                type="submit"
                className="w-100 login__py mt-3 auth-submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <p className="mt-4 mb-0">
                Bạn chưa có tài khoản? <a href="/register">Đăng ký tài khoản ngay hôm nay</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}