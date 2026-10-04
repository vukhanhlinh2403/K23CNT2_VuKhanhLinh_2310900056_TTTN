import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth.service";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setMessage(
        "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn."
      );
    } catch {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại.");
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
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl font-bold text-[#7f8cff] shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  TFT Academy
                </h1>
                <p className="text-sm text-blue-100">Đào tạo nhân tài</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                SMART ADMISSION
              </p>
              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Khôi phục
                <br />
                mật khẩu
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
                Nhập email của bạn để nhận liên kết xác thực đặt lại mật khẩu truy cập hệ thống.
              </p>
            </div>

            <div className="flex justify-center">
              <p className="text-sm text-blue-200">© 2026 TFT Academy</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex min-h-screen items-center justify-center bg-[#1b1c1f] px-6 py-12">
          <div className="w-full max-w-[435px]">
            <Link
              to="/login"
              className="mb-7 inline-flex items-center text-sm font-semibold text-[#8190ff] hover:text-[#a4adff]"
            >
              ← Quay lại đăng nhập
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-[#7f8cff]">
                KHÔI PHỤC TÀI KHOẢN
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Quên mật khẩu?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#858a98]">
                Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn để bạn đặt lại mật khẩu.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#37383d] bg-[#111214] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#687080] focus:border-[#5364ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#5060ff] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5060ff]/20 transition hover:bg-[#5a69ff] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#777d89]">
              Nhớ mật khẩu rồi?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#8190ff] hover:text-[#a4adff]"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
