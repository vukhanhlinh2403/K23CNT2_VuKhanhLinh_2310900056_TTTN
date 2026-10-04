import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token") || "demo-token";
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Email đã được xác thực thành công.");
      } catch {
        setStatus("error");
        setMessage("Token xác thực không hợp lệ hoặc đã hết hạn.");
      }
    };
    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#1b1c1f] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111214] p-8 rounded-2xl border border-gray-800 shadow-2xl text-center space-y-4">
        {status === "loading" && (
          <div>
            <h2 className="text-xl font-bold text-white">Đang xác thực email...</h2>
            <p className="text-xs text-gray-400 mt-2">Vui lòng chờ trong giây lát.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">Xác thực thành công!</h2>
            <p className="text-xs text-gray-400 mt-2">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-xl font-bold text-red-400">Xác thực thất bại</h2>
            <p className="text-xs text-gray-400 mt-2">{message}</p>
            <Link
              to="/register"
              className="mt-5 inline-block text-xs text-blue-400 hover:underline"
            >
              Quay lại đăng ký
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
