import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

// Admin Pages
import Dashboard from "../pages/dashboard/Dashboard";
import ChatBotPage from "../pages/chatbot/ChatBotPage";
import LeadsList from "../pages/leads/LeadsList";
import CoursesList from "../pages/courses/CoursesList";
import ClassesList from "../pages/classes/ClassesList";
import StudentsList from "../pages/students/StudentsList";
import TeachersList from "../pages/teachers/TeachersList";
import PaymentsList from "../pages/payments/PaymentsList";
import UsersList from "../pages/users/UsersList";

// User Pages
import UserDashboard from "../pages/users/UserDashboard";
import UserApply from "../pages/users/UserApply";
import UserMajors from "../pages/users/UserMajors";
import UserPayments from "../pages/users/UserPaymments";

// Home Page
import HomePage from "../pages/home/HomePage";

// Component điều hướng thông minh cho cổng portal "/portal"
function PortalRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Phân quyền theo role:
  // Admin hoặc Manager -> vào trang quản trị Admin (/dashboard)
  // User hoặc Student -> vào trang cổng người dùng (/user)
  if (user.role === "admin" || user.role === "manager") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/user" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang Chủ (Landing Page Tuyển Sinh 2026) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/portal" element={<PortalRedirect />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ADMIN ROUTES (Chỉ Admin, Manager, Teacher có quyền vào) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "teacher"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/leads" element={<LeadsList />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/classes" element={<ClassesList />} />
        <Route path="/students" element={<StudentsList />} />
        <Route path="/teachers" element={<TeachersList />} />
        <Route path="/payments" element={<PaymentsList />} />
        <Route path="/users" element={<UsersList />} />
      </Route>

      {/* USER ROUTES (Dành cho Thí sinh / Người dùng) */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user", "admin", "manager"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="apply" element={<UserApply />} />
        <Route path="majors" element={<UserMajors />} />
        <Route path="payments" element={<UserPayments />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
