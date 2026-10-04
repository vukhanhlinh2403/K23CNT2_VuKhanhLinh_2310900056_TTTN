import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  Bot
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { formatCurrencyVND } from '../../utils/formatters';
import type { Course } from '../../types';

export default function UserMajors() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCourses(admissionService.getCourses());
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search) ||
      c.faculty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-fuchsia-700 border border-pink-200 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chương Trình Đào Tạo 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tra Cứu Ngành Đào Tạo, Điểm Chuẩn & Học Phí
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Chọn ngành học phù hợp với sở trường, định hướng nghề nghiệp và tổ hợp môn thi
          </p>
        </div>

        <Link
          to="/user/chat"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-violet-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <Bot className="w-4 h-4" />
          <span>Hỏi AI Tư Vấn Chọn Ngành</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên ngành, mã ngành hoặc khoa..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-fuchsia-500 focus:bg-white transition"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
          Hiển thị: <strong>{filtered.length}</strong> ngành đào tạo
        </span>
      </div>

      {/* Grid of Majors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-pink-50 text-fuchsia-700 font-semibold">
                  Mã: {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Điểm chuẩn: {c.previousCutoffScore}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">
                {c.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{c.faculty}</p>

              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {c.description}
              </p>

              <div className="space-y-2 py-3 border-t border-b border-gray-100 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <GraduationCap className="w-3.5 h-3.5" /> Chỉ tiêu tuyển sinh:
                  </span>
                  <strong className="text-gray-900">{c.quota} SV</strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Award className="w-3.5 h-3.5" /> Mức học phí:
                  </span>
                  <strong className="text-fuchsia-600 font-semibold">{formatCurrencyVND(c.tuitionPerTerm)}/kỳ</strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Layers className="w-3.5 h-3.5" /> Tổ hợp môn:
                  </span>
                  <div className="flex gap-1">
                    {c.subjectGroups.map((grp) => (
                      <span key={grp} className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-sm text-[10px] font-mono font-semibold">
                        {grp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Đào tạo: {c.durationYears} năm</span>
              <Link
                to="/user/apply"
                className="inline-flex items-center gap-1 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl transition"
              >
                <span>Đăng Ký Ngành Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
