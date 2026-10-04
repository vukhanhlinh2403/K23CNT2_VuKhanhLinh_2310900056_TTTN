import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import type { UserRole } from "../../types";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as UserRole,
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1c1f]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4d52ff] via-[#4c1fe5] to-[#202456]" />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl font-bold text-[#7f8cff] shadow-lg">
                  A
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Admission Chatbot
                  </h1>
                  <p className="text-sm text-blue-100">AI hỗ trợ tuyển sinh</p>
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                SMART ADMISSION
              </p>
              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Tạo tài khoản
                <br />
                xét tuyển 2026
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
                Đăng ký để nộp hồ sơ xét học bạ, nhận kết quả trúng tuyển sớm và kết nối với ban tư vấn tuyển sinh đại học.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                  AI Assistant
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                  Tuyển sinh
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                  24/7
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <p className="text-sm text-blue-200">© 2026 Admission Chatbot</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex min-h-screen items-center justify-center bg-[#1b1c1f] px-6 py-12">
          <div className="w-full max-w-[435px]">
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-[#7f8cff]">
                TẠO TÀI KHOẢN MỚI
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Đăng ký
              </h2>
              <p className="mt-2 text-sm text-[#858a98]">
                Tạo tài khoản để bắt đầu nộp hồ sơ hoặc quản lý hệ thống.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-xs font-medium text-gray-200"
                >
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#687080] focus:border-[#5364ff]"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1 block text-xs font-medium text-gray-200"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#687080] focus:border-[#5364ff]"
                />
              </div>

              {/* Choose Role */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-200">
                  Loại tài khoản (Phân quyền)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3 text-sm text-white outline-none transition focus:border-[#5364ff]"
                >
                  <option value="user">Thí sinh / Người dùng (User)</option>
                  <option value="admin">Cán bộ / Quản trị viên (Admin)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1 block text-xs font-medium text-gray-200"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3 pr-16 text-sm text-white outline-none transition placeholder:text-[#687080] focus:border-[#5364ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-[#747b89] hover:text-white"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-xs font-medium text-gray-200"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3 pr-16 text-sm text-white outline-none transition placeholder:text-[#687080] focus:border-[#5364ff]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-[#747b89] hover:text-white"
                  >
                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#5060ff] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5060ff]/20 transition hover:bg-[#5a69ff] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#777d89]">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#8190ff] hover:text-[#a4adff]"
              >
                Đăng nhập
              </Link>
            </p>

            <div className="mt-4 pt-3 border-t border-[#2a2b30] text-center">
              <Link
                to="/"
                className="text-xs text-[#8190ff] hover:underline"
              >
                ← Quay về Trang chủ Tuyển sinh
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
