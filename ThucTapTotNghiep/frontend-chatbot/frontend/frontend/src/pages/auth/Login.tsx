import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User as UserIcon, ArrowRight, Bot } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccessfulLogin = (loggedInUser: any) => {
    // Phân quyền chuyển hướng:
    // Nếu là admin / cán bộ tuyển sinh -> vào /dashboard
    // Nếu là user / thí sinh -> vào /user
    if (loggedInUser?.role === "admin" || loggedInUser?.role === "manager") {
      navigate("/dashboard");
    } else {
      navigate("/user");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      if (remember) {
        localStorage.setItem("rememberLogin", "true");
      } else {
        localStorage.removeItem("rememberLogin");
      }

      handleSuccessfulLogin(user);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Email hoặc mật khẩu không chính xác."
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick demo accounts login
  const handleQuickLogin = async (demoRole: "admin" | "user") => {
    try {
      setLoading(true);
      setError("");
      const demoEmail =
        demoRole === "admin"
          ? "admin@admission.edu.vn"
          : "user@admission.edu.vn";
      const demoPass = "123456";

      setEmail(demoEmail);
      setPassword(demoPass);

      const user = await login(demoEmail, demoPass);
      handleSuccessfulLogin(user);
    } catch {
      setError("Không thể đăng nhập tài khoản mẫu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT */}
        <section className="login-intro">
          <div className="brand">
            <div className="brand-logo">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div className="brand-text">
              <h1>Admission Portal</h1>
              <p>Hệ thống Tuyển sinh Thông minh</p>
            </div>
          </div>

          <div className="intro-content">
            <span className="intro-badge">SMART ADMISSION 2026</span>
            <h2>
              Trợ lý tuyển sinh
              <br />
              thông minh & phân quyền
            </h2>
            <p>
              Hỗ trợ tra cứu thông tin tuyển sinh, phân quyền tự động giữa Quản
              trị viên (Admin) và Thí sinh nộp hồ sơ (User).
            </p>

            <div className="intro-features">
              <span>Chatbot AI 24/7</span>
              <span>Xét học bạ Online</span>
              <span>Phân quyền Admin / User</span>
            </div>
          </div>

          <div className="login-footer">© 2026 Admission AI Portal</div>
        </section>

        {/* RIGHT */}
        <section className="login-card">
          <div className="login-form-container">
            <div className="login-header">
              <span className="login-label">CHÀO MỪNG TRỞ LẠI</span>
              <h2>Đăng nhập</h2>
              <p>Đăng nhập tài khoản để vào hệ thống quản lý hoặc cổng thí sinh.</p>
            </div>

            {/* Quick Demo Role Switcher Buttons */}
            <div className="mb-5 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Đăng nhập mẫu theo phân quyền:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900/50 text-xs font-semibold transition cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  <span>Vào Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("user")}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:bg-blue-900/50 text-xs font-semibold transition cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vào Thí Sinh (User)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="login-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email tài khoản</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@admission.edu.vn hoặc user@admission.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label htmlFor="password">Mật khẩu</label>
                  <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu (hoặc mật khẩu mẫu 123456)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  Hệ thống tự nhận diện Role
                </span>
              </div>

              <button
                type="submit"
                className="login-button flex items-center justify-center gap-2"
                disabled={loading}
              >
                <span>{loading ? "Đang xác thực..." : "Đăng nhập"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="register-link">
              <span>Chưa có tài khoản thí sinh?</span>
              <Link to="/register">Đăng ký hồ sơ mới</Link>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-blue-600 transition inline-flex items-center gap-1.5"
              >
                <span>← Quay về Trang chủ Tuyển sinh</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
