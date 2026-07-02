import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hook/useAuth';
import { FaGoogle, FaFacebookF } from '../icons';
import loginImg from '../assets/img/login_image.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [validationError, setValidationError] = useState("");
  const [form, setForm] = useState({
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
    const email = form.email.trim()
    const password =  form.password
    if (!email || !password) {
      setValidationError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    try {
      const data = await login({ email, password });
      navigate(
        data.user.role === 'admin'
          ? '/admin/dashboard'
          : '/courses'
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container login-page">
      <div className="row h-100">
        <div className="d-none d-lg-flex col-lg-6 login-left flex-column justify-content-center align-items-center text-center">
          <img src={loginImg} alt="Login" className="login-left__img" />
          <div className="login-left__content">
            <p className="login-left__note">Bạn có biết?</p>
            <p className="login-left__text">
              Học tập là chìa khóa của thành công
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

              <h2 className="login-title">Welcome back</h2>
              <p className="login-subtitle">
                Enter your details to access your dashboard
              </p>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <button type="button" className="login-social__btn w-100">
                  <FaGoogle /> <span>Google</span>
                </button>
              </div>
              <div className="col-6">
                <button type="button" className="login-social__btn w-100">
                  <FaFacebookF /> <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="login-divider">
              <span>Or continue with email</span>
            </div>

            <form onSubmit={handleSubmit}>

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
                <div className="d-flex justify-content-between">
                  <label className="login-label">Password</label>
                  <a href="/forgot-password" className="login-link">
                    Forgot?
                  </a>
                </div>

                <input
                  type="password"
                  className="login-input"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {validationError
                ? <p className="text-danger mb-2">{validationError}</p>
                : error && <p className="text-danger mb-2">{error}</p>
              }

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Sign In'}
              </button>

              <p className="login-footer">
                Don’t have an account?{" "}
                <a href="/auth/register">Create one</a>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}