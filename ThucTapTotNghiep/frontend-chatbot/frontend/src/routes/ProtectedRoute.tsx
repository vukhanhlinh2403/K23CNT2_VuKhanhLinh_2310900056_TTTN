import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-xs text-gray-400">
            Đang kiểm tra phân quyền tài khoản...
          </p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Không có quyền truy cập route hiện tại
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    // Student / User → cổng người dùng
    if (
      user.role === "student" ||
      user.role === "user"
    ) {
      return (
        <Navigate
          to="/user"
          replace
        />
      );
    }

    // Admin / Manager / Teacher
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}