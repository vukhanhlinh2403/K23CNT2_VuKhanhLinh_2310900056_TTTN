import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import tftLogo from "../../assets/tft-logo(1).png";

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
    if (
      loggedInUser?.role === "admin" ||
      loggedInUser?.role === "manager"
    ) {
      navigate("/dashboard");
    } else {
      navigate("/user");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Vui lòng nhập đầy đủ email và mật khẩu."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await login(
        email.trim(),
        password
      );

      console.log(
        "LOGIN USER:",
        user
      );

      // ==================================================
      // KIỂM TRA TÀI KHOẢN ĐÃ XÁC THỰC EMAIL CHƯA
      // ==================================================

      try {
  setLoading(true);

  const user = await login(
    email.trim(),
    password
  );

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

      // ==================================================
      // GHI NHỚ ĐĂNG NHẬP
      // ==================================================

      if (remember) {
        localStorage.setItem(
          "rememberLogin",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberLogin"
        );
      }

      // ==================================================
      // ĐĂNG NHẬP THÀNH CÔNG
      // ==================================================

      handleSuccessfulLogin(user);

    } catch (err: any) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Email hoặc mật khẩu không chính xác."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* =========================================
            LEFT
        ========================================= */}

        <section className="login-intro">

          <div
            className="login-network network-left"
            aria-hidden="true"
          />

          <div className="brand">

            <div className="brand-logo">
              <img
                src={tftLogo}
                alt="TFT Academy"
              />
            </div>

            <div className="brand-text">
              <h1>TFT Academy</h1>
              <p>Đào tạo nhân tài</p>
            </div>

          </div>

          <div
            className="intro-art"
            aria-hidden="true"
          >
            <div className="art-book">⌁</div>
            <div className="art-bulb">✦</div>
            <div className="art-shield">T</div>
            <div className="art-graduation">⌢</div>
            <div className="art-building">⌂</div>
            <div className="art-flask">⚗</div>
            <div className="art-books">▤</div>
            <div className="art-search">◯</div>
            <div className="art-compass">◈</div>
          </div>

          <div
            className="intro-content"
            style={{
              position: "absolute",
              left: "7%",
              top: "50%",
              bottom: "auto",
              transform: "translateY(-50%)",
              width: "86%",
              zIndex: 5,
            }}
          >
            <span className="intro-badge">
              SMART ADMISSION
            </span>

            <h2>
              Trợ lý tuyển sinh
              <br />
              thông minh
            </h2>

            <p>
              Hỗ trợ tra cứu thông tin tuyển sinh,
              ngành học và giải đáp các câu hỏi
              nhanh chóng bằng công nghệ AI.
            </p>
          </div>

          <div className="login-footer">
            © 2026 TFT Academy
          </div>

        </section>

        {/* =========================================
            RIGHT
        ========================================= */}

        <section className="login-card">

          <div
            className="login-network network-right"
            aria-hidden="true"
          />

          <div
            className="login-form-container"
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >

            <div className="login-header">

              <span className="login-label">
                CHÀO MỪNG TRỞ LẠI
              </span>

              <h2>Đăng nhập</h2>

              <p>
                Đăng nhập để quản lý tuyển sinh
                và hệ thống Chatbot AI.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* ERROR */}

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="namlong145@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

              {/* PASSWORD */}

              <div className="form-group">

                <div className="password-label">

                  <label htmlFor="password">
                    Mật khẩu
                  </label>

                  <Link to="/forgot-password">
                    Quên mật khẩu?
                  </Link>

                </div>

                <div className="password-input">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Ẩn"
                      : "Hiện"}
                  </button>

                </div>

              </div>

              {/* OPTIONS */}

              <div className="login-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Ghi nhớ đăng nhập
                  </span>

                </label>

                <span className="sample-account">
                  Tài khoản mẫu
                </span>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Đang xác thực..."
                    : "Đăng nhập"}
                </span>

                <ArrowRight className="login-arrow" />

              </button>

            </form>

            {/* REGISTER */}

            <div className="register-link">

              <span>
                Chưa có tài khoản?
              </span>

              <Link to="/register">
                Đăng ký ngay
              </Link>

            </div>

            {/* HOME */}

            <div
              className="home-link"
              style={{
                marginTop: "22px",
                textAlign: "center",
              }}
            >

              <Link to="/">
                ← Quay về Trang chủ Tuyển sinh
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}