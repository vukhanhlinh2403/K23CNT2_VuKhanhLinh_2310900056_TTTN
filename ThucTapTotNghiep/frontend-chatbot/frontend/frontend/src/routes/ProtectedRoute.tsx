import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Đang kiểm tra phân quyền tài khoản...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển về trang đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng không có vai trò phù hợp:
  // Nếu là user thường mà cố vào admin -> tự động chuyển sang trang người dùng /user
  // Nếu là admin mà vào trang user -> vẫn cho phép hoặc điều hướng tùy chọn
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "user") {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
