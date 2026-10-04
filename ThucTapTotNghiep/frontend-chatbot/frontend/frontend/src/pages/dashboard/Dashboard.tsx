import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  GraduationCap,
  CreditCard,
  Bot,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  PhoneCall,
  Plus,
  ExternalLink
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/common/Badge';
import { admissionService } from '../../services/adminssion.service';
import { formatCurrencyVND, formatDate, formatLeadStatus } from '../../utils/formatters';
import type { Lead, Student, Course } from '../../types';

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setLeads(admissionService.getLeads());
    setStudents(admissionService.getStudents());
    setCourses(admissionService.getCourses());
  }, []);

  const totalRevenue = admissionService
    .getPayments()
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const chatbotLeadsCount = leads.filter((l) => l.source === 'chatbot').length;

  return (
    <div className="space-y-6">
      {/* Banner Top */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Hệ thống Tuyển sinh Đại học & Chatbot AI 2026 - Phân quyền Quản Trị</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Bảng Điều Khiển Quản Trị Tuyển Sinh (Admin)
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Giám sát tình hình tuyển sinh theo thời gian thực, quản lý thí sinh quan tâm, kết quả xét tuyển và hiệu quả tư vấn tự động qua Chatbox AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/user"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition shadow-sm"
            >
              <ExternalLink className="w-4.5 h-4.5" />
              <span>Xem Trang Thí Sinh (User)</span>
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition shadow-sm"
            >
              <Bot className="w-4.5 h-4.5 text-blue-600" />
              <span>Mở Chatbox AI</span>
            </Link>
            <Link
              to="/leads"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition"
            >
              <UserCheck className="w-4.5 h-4.5" />
              <span>Thí sinh tiềm năng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Thí sinh tiềm năng (Leads)"
          value={leads.length}
          subtext={`${chatbotLeadsCount} từ Chatbot AI`}
          icon={UserCheck}
          color="blue"
          trend="+28% tuần này"
        />
        <StatCard
          title="Hồ sơ đã tiếp nhận"
          value={students.length}
          subtext="Đã nộp hồ sơ xét tuyển"
          icon={GraduationCap}
          color="indigo"
          trend="+15%"
        />
        <StatCard
          title="Ngành đào tạo tuyển sinh"
          value={courses.length}
          subtext="Đang mở chỉ tiêu xét tuyển"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Lệ phí & Học phí tạm thu"
          value={formatCurrencyVND(totalRevenue)}
          subtext="Qua VNPay, MoMo, Ngân hàng"
          icon={CreditCard}
          color="emerald"
          trend="Đạt 92% kỳ"
        />
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Leads & Top Majors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Thí sinh mới quan tâm (Leads)
                </h3>
                <p className="text-xs text-gray-500">
                  Thí sinh vừa liên hệ qua Chatbot AI và các kênh trực tuyến
                </p>
              </div>
              <Link
                to="/leads"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100 overflow-x-auto">
              {leads.slice(0, 4).map((lead) => {
                const statusStyle = formatLeadStatus(lead.status);
                return (
                  <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {lead.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900">{lead.fullName}</h4>
                          <Badge variant={lead.source === 'chatbot' ? 'blue' : 'gray'}>
                            {lead.source === 'chatbot' ? 'Từ Chatbot' : lead.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {lead.phone} • {lead.desiredMajor}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Courses Overview */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Chỉ tiêu & Điểm chuẩn các ngành tiêu biểu
                </h3>
                <p className="text-xs text-gray-500">
                  Dữ liệu được tích hợp trực tiếp vào Chatbot AI để tư vấn cho thí sinh
                </p>
              </div>
              <Link
                to="/courses"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Chi tiết ngành</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {courses.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/40 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-gray-400">Mã: {c.code}</span>
                    <span className="text-xs font-bold text-blue-600">ĐC: {c.previousCutoffScore}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">{c.name}</h4>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Chỉ tiêu: <strong className="text-gray-700">{c.quota}</strong></span>
                    <span>{formatCurrencyVND(c.tuitionPerTerm)}/kỳ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Chatbot Spotlight & Quick Actions */}
        <div className="space-y-6">
          {/* AI Chatbot Status Box */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-blue-200" />
                <h3 className="font-bold text-base">Trợ Lý AI Tuyển Sinh</h3>
              </div>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Đang trực tuyến
              </span>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              Chatbot AI đang hỗ trợ tự động giải đáp 24/7 về các câu hỏi điểm chuẩn, học bổng, học phí và biểu mẫu hồ sơ.
            </p>

            <div className="space-y-2 mb-5">
              <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-blue-100">Số lượt tư vấn hôm nay</span>
                <span className="font-bold text-white text-sm">342 lượt</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-blue-100">Tỷ lệ để lại số điện thoại</span>
                <span className="font-bold text-white text-sm">48.2%</span>
              </div>
            </div>

            <Link
              to="/chatbot"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-xs py-2.5 rounded-xl hover:bg-blue-50 transition shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Trải nghiệm Chatbox AI</span>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Thao Tác Nhanh</h3>
            <div className="space-y-2">
              <Link
                to="/leads"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600">
                    Thêm Thí Sinh Mới
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/students"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600">
                    Xét Duyệt Hồ Sơ
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                to="/teachers"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-600">
                    Phân Công Ban Tư Vấn
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
