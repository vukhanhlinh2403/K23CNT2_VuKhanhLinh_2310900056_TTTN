import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  BookOpen,
  School,
  CreditCard,
  Sparkles,
  UserCircle
} from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { name: 'Dashboard (Tổng quan)', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Chatbot AI Tuyển Sinh', path: '/chatbot', icon: Bot, highlight: true },
    { name: 'Leads (Thí sinh quan tâm)', path: '/leads', icon: UserCheck },
    { name: 'Students (Hồ sơ xét tuyển)', path: '/students', icon: GraduationCap },
    { name: 'Courses (Ngành học)', path: '/courses', icon: BookOpen },
    { name: 'Classes (Đợt tuyển sinh)', path: '/classes', icon: School },
    { name: 'Teachers (Ban tư vấn)', path: '/teachers', icon: Briefcase },
    { name: 'Payments (Lệ phí / Học phí)', path: '/payments', icon: CreditCard },
    { name: 'Users (Người dùng hệ thống)', path: '/users', icon: Users },
    { name: 'Trang thí sinh (User Portal)', path: '/user', icon: UserCircle },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Quản Trị Tuyển Sinh (Admin)
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? item.highlight
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                          : 'bg-blue-50 text-blue-600 font-semibold'
                        : item.highlight
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto inline-flex items-center text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-3.5 border border-blue-100 text-xs">
          <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Phân quyền Quản Trị</span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Đang đăng nhập quyền Admin với đầy đủ quyền quản lý hồ sơ, ngành học và phân quyền.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
