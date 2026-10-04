import { useState, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "demo-token";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setSuccess("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Không thể đặt lại mật khẩu. Link có thể đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1c1f] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111214] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Đặt lại mật khẩu</h2>
        <p className="text-xs text-gray-400 mb-6">Nhập mật khẩu mới an toàn cho tài khoản của bạn.</p>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full bg-[#1b1c1f] border border-[#37383d] rounded-xl px-3.5 py-3 text-white focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full bg-[#1b1c1f] border border-[#37383d] rounded-xl px-3.5 py-3 text-white focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer mt-4"
          >
            {loading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-blue-400 hover:underline">
            ← Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
