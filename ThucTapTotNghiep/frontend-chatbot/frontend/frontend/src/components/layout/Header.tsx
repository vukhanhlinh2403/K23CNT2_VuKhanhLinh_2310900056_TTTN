import { useNavigate, Link } from 'react-router-dom';
import { Bot, LogOut, Bell, User as UserIcon, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-blue-600 tracking-tight leading-tight">
              Admission Chatbot
            </h1>
            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> ADMIN
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Hệ thống Quản trị Tuyển sinh Đại học & Tư vấn AI</p>
        </div>
      </div>

      {/* Quick Access to Chatbot & User Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition border border-gray-200"
          title="Về Trang chủ Tuyển sinh 2026"
        >
          <span>Trang Chủ</span>
        </Link>

        <Link
          to="/user"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition border border-emerald-200/60"
          title="Mở giao diện dành cho Thí sinh / Người dùng"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem Trang Người Dùng</span>
        </Link>

        <Link
          to="/chatbot"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition border border-blue-200/60"
        >
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Chatbox Tư Vấn Tuyển Sinh</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </Link>

        <button 
          type="button" 
          aria-label="Thông báo"
          className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              {user?.fullName || "Ban Tuyển Sinh"}
            </p>
            <p className="text-[11px] text-gray-500 leading-tight">
              {user?.email || "admin@admission.edu.vn"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
