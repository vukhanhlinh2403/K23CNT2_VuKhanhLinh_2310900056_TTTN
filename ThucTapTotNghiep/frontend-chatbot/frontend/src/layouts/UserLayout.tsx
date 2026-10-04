import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  FileCheck,
  CreditCard,
  BookOpen,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import tftLogo from '../assets/tft-logo.png';

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: Home, end: true },
    { name: 'Hồ sơ của tôi', path: '/user', icon: FileCheck, end: true },
    { name: 'Nộp hồ sơ online', path: '/user/apply', icon: GraduationCap },
    { name: 'Tra cứu ngành học', path: '/user/majors', icon: BookOpen },
    { name: 'Lệ phí & Biên lai', path: '/user/payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/user" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={tftLogo}
                    alt="TFT Academy"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-base leading-tight">
                      TFT Academy
                    </span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      USER
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">Đào tạo nhân tài</p>
                </div>
              </Link>
            </div>

            {/* Nav links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Admin Switcher if role is admin */}
              {user?.role === 'admin' && (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition border border-red-200/60"
                  title="Chuyển sang trang Quản trị viên"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Về Trang Admin</span>
                </Link>
              )}

              <button
                type="button"
                aria-label="Thông báo"
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              {/* User profile */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">
                    {user?.fullName || 'Thí sinh'}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    Mã TS: {user?.candidateCode || 'TS2026-88991'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-gray-100 px-4 py-2 flex items-center justify-around overflow-x-auto gap-2 bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Cổng Thông Tin Tuyển Sinh & Tư Vấn Thí Sinh Trực Tuyến.</p>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span>Hotline: 1900 6868</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-600">
              <Sparkles className="w-3.5 h-3.5" /> Tích hợp Trợ lý Tuyển sinh AI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserLayout;
