import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Send,
  LogIn,
  LayoutDashboard,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { admissionService } from "../../services/adminssion.service";
import { formatCurrencyVND } from "../../utils/formatters";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Search major state
  const [searchQuery, setSearchQuery] = useState("");
  const courses = admissionService.getCourses();

  // Lead registration form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMajor, setLeadMajor] = useState("Trí tuệ Nhân tạo (AI & Data Science)");
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Score Calculator state
  const [mathScore, setMathScore] = useState<number>(8.5);
  const [physicsScore, setPhysicsScore] = useState<number>(8.0);
  const [chemOrEngScore, setChemOrEngScore] = useState<number>(8.5);
  const [calcCombo, setCalcCombo] = useState<string>("A00");

  const totalCalcScore = (
    Number(mathScore) +
    Number(physicsScore) +
    Number(chemOrEngScore)
  ).toFixed(2);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subjectGroups.some((sg) =>
        sg.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    admissionService.saveLead({
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail || "chua_co@gmail.com",
      desiredMajor: leadMajor,
      source: "landing_page",
      expectedScore: Number(totalCalcScore) || 25,
      notes: "Đăng ký nhận tư vấn từ biểu mẫu trang chủ",
    });

    setLeadSuccess(true);
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setTimeout(() => setLeadSuccess(false), 5000);
  };

  const methods = [
    {
      code: "PT 100",
      title: "Xét Kết Quả Học Bạ THPT",
      desc: "Xét tuyển điểm trung bình tổ hợp 3 môn cả năm Lớp 12 hoặc điểm 3 học kỳ (HK1, HK2 lớp 11 và HK1 lớp 12). Cơ hội trúng tuyển sớm với điểm chuẩn linh hoạt.",
      badge: "Ưu tiên đợt 1",
      icon: BookOpen,
      time: "Từ 01/03/2026 đến 30/05/2026",
    },
    {
      code: "PT 200",
      title: "Xét Điểm Thi Tốt Nghiệp THPT",
      desc: "Căn cứ vào kết quả kỳ thi tốt nghiệp THPT 2026 theo các tổ hợp môn quy định của Bộ Giáo dục & Đào tạo. Xét tuyển công bằng, công khai và minh bạch.",
      badge: "Chính thức",
      icon: Award,
      time: "Theo lịch của Bộ GD&ĐT",
    },
    {
      code: "PT 402",
      title: "Xét Điểm Đánh Giá Năng Lực (ĐHQG)",
      desc: "Sử dụng kết quả kỳ thi Đánh giá năng lực của ĐHQG Hà Nội hoặc ĐHQG TP.HCM. Không giới hạn số lần dự thi và phương thức xét phụ trợ.",
      badge: "Tối ưu điểm số",
      icon: CheckCircle2,
      time: "Đợt 1 & Đợt 2 năm 2026",
    },
    {
      code: "PT 301",
      title: "Tuyển Thẳng & Ưu Tiên Xét Tuyển",
      desc: "Dành cho học sinh đạt giải HSG quốc gia, quốc tế, học sinh trường THPT chuyên hoặc sở hữu chứng chỉ quốc tế IELTS từ 6.0+, SAT từ 1200+.",
      badge: "Học bổng 100%",
      icon: Sparkles,
      time: "Nhận hồ sơ liên tục",
    },
  ];

  const faqs = [
    {
      q: "Thời gian mở cổng nhận hồ sơ xét học bạ THPT năm 2026 là khi nào?",
      a: "Hệ thống chính thức mở cổng nhận hồ sơ xét tuyển học bạ Đợt 1 từ ngày 01/03/2026 đến ngày 30/05/2026. Thí sinh có thể nộp hồ sơ hoàn toàn trực tuyến tại cổng thông tin thí sinh mà không cần đến trường nộp trực tiếp.",
    },
    {
      q: "Nộp hồ sơ xét tuyển sớm có ảnh hưởng đến việc thi tốt nghiệp THPT không?",
      a: "Hoàn toàn KHÔNG. Việc đăng ký xét tuyển sớm giúp thí sinh nắm chắc cơ hội trúng tuyển có điều kiện vào trường, giải tỏa áp lực thi cử và vẫn được dự thi tốt nghiệp THPT bình thường.",
    },
    {
      q: "Trường có những chính sách học bổng nào cho tân sinh viên khóa 2026?",
      a: "Nhà trường dành quỹ học bổng 50 tỷ đồng với các mức: Học bổng Thủ khoa (100% học phí toàn khóa), Học bổng Tài năng (50% - 100% năm đầu) cho thí sinh có điểm xét tuyển cao hoặc có chứng chỉ IELTS 6.5+, cùng học bổng Khuyến khích học tập theo từng kỳ.",
    },
    {
      q: "Lệ phí xét tuyển hồ sơ là bao nhiêu và thanh toán như thế nào?",
      a: "Lệ phí xét tuyển trực tuyến là 300.000 VNĐ/hồ sơ. Thí sinh có thể thanh toán thuận tiện qua VNPay, ví MoMo, hoặc quét mã QR ngân hàng tự động ngay trên cổng thông tin người dùng.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">
                  ĐẠI HỌC TUYỂN SINH
                </span>
                <span className="bg-pink-100 text-fuchsia-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Cổng thông tin tuyển sinh & Trợ lý tư vấn AI 24/7
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#nganh-dao-tao" className="hover:text-fuchsia-600 transition">
              Ngành đào tạo
            </a>
            <a href="#phuong-thuc" className="hover:text-fuchsia-600 transition">
              Phương thức xét tuyển
            </a>
            <a href="#tinh-diem" className="hover:text-fuchsia-600 transition">
              Tính điểm học bạ
            </a>
            <a href="#hoc-phi" className="hover:text-fuchsia-600 transition">
              Học bổng & Học phí
            </a>
            <a href="#faq" className="hover:text-fuchsia-600 transition">
              Hỏi đáp
            </a>
          </nav>

          {/* User Auth Status / Action Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              user.role === "admin" || user.role === "manager" ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Vào Trang Quản Trị</span>
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </Link>
              ) : (
                <Link
                  to="/user"
                  className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-teal-500 hover:from-fuchsia-700 hover:to-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Cổng Thí Sinh</span>
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded">
                    {user.fullName?.split(" ").pop() || "Thí sinh"}
                  </span>
                </Link>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-fuchsia-600 px-3.5 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                >
                  <span>Nộp hồ sơ ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-fuchsia-800 via-violet-800 to-teal-700 text-white py-20 lg:py-28">
        {/* Glow decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-pink-400/30 text-pink-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chính thức mở cổng đăng ký xét tuyển Đại học năm 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Định Hình Tương Lai Cùng Các Ngành{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-sky-300 to-violet-300">
                Công Nghệ & Kinh Doanh Số
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Đăng ký xét tuyển sớm bằng Học bạ THPT & Điểm thi ĐGNL 2026. Cơ hội
              nhận 500+ suất học bổng tài năng trị giá lên tới 100% học phí toàn
              khóa học.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(user?.role === "admin" ? "/dashboard" : "/user/apply");
                  } else {
                    navigate("/register");
                  }
                }}
                className="bg-gradient-to-r from-fuchsia-500 via-amber-400 to-teal-500 hover:from-fuchsia-600 hover:to-violet-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-fuchsia-500/25 transition cursor-pointer flex items-center gap-2"
              >
                <span>Nộp Hồ Sơ Trực Tuyến Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#nganh-dao-tao"
                className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition"
              >
                Tra cứu ngành & Điểm chuẩn
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 border-t border-white/10 mt-8">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hồ sơ 100%
                online
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Trợ lý AI
                giải đáp 24/7
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kết quả
                xét tuyển chỉ sau 48h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Metrics Bar */}
      <section className="bg-white border-b border-gray-200 py-8 relative -mt-6 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-2xl shadow-xl z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-fuchsia-600">
              3,500+
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Chỉ tiêu tuyển sinh 2026
            </p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-violet-600">
              15+
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ngành đón đầu công nghệ
            </p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              98.2%
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Việc làm sau tốt nghiệp
            </p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              50 Tỷ
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quỹ học bổng tài năng
            </p>
          </div>
        </div>
      </section>

      {/* 4. Phương thức xét tuyển 2026 */}
      <section id="phuong-thuc" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-block text-xs font-bold text-fuchsia-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Chính sách tuyển sinh
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            4 Phương Thức Xét Tuyển Linh Hoạt Năm 2026
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thí sinh có thể chọn một hoặc nhiều phương thức đồng thời để gia tăng
            cơ hội trúng tuyển sớm vào ngành học yêu thích.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methods.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 text-fuchsia-600 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-full">
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {m.code}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {m.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-fuchsia-500" />
                  <span>{m.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Danh Mục Ngành Đào Tạo 2026 */}
      <section id="nganh-dao-tao" className="py-20 bg-slate-100/70 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <div className="inline-block text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Chương trình đào tạo
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Các Ngành Đào Tạo Xu Hướng 2026
              </h2>
              <p className="text-sm text-gray-500">
                Chương trình chất lượng cao ứng dụng thực tiễn, đào tạo gắn liền với doanh nghiệp.
              </p>
            </div>

            {/* Search filter */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm ngành, mã ngành..."
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-fuchsia-600 bg-pink-50 px-2.5 py-1 rounded-lg">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {course.quota} chỉ tiêu
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                    {course.name}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 py-3 border-t border-b border-gray-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Tổ hợp môn xét:</span>
                      <div className="flex gap-1">
                        {course.subjectGroups.map((sg) => (
                          <span
                            key={sg}
                            className="bg-gray-100 font-mono font-bold text-gray-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {sg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Điểm chuẩn tham khảo:</span>
                      <span className="font-bold text-violet-600 font-mono">
                        {course.previousCutoffScore} điểm
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Học phí dự kiến:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrencyVND(course.tuitionPerTerm)} / kỳ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to={isAuthenticated ? "/user/apply" : "/register"}
                    className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-fuchsia-600 text-gray-700 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-gray-200 hover:border-fuchsia-600 transition"
                  >
                    <span>Nộp hồ sơ ngành này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to={isAuthenticated ? "/user/majors" : "/login"}
              className="inline-flex items-center gap-2 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 bg-white border border-pink-200 hover:border-pink-400 px-5 py-3 rounded-xl shadow-2xs transition"
            >
              <span>Xem toàn bộ 15+ ngành đào tạo và chỉ tiêu chi tiết</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Công cụ tính điểm học bạ tương tác */}
      <section id="tinh-diem" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-fuchsia-700 via-amber-400 to-teal-600 rounded-3xl text-white p-8 lg:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left col */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-block text-xs font-bold bg-fuchsia-500/20 text-pink-200 border border-pink-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                Công cụ hỗ trợ
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Dự Đoán Điểm & Khả Năng Trúng Tuyển Sớm
              </h2>
              <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
                Nhập điểm trung bình các môn theo tổ hợp môn học bạ THPT để tính
                ngay tổng điểm và kiểm tra khả năng đỗ vào các ngành top đầu năm 2026.
              </p>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-200">Tổ hợp môn đang chọn:</span>
                  <div className="flex gap-2">
                    {["A00", "A01", "D01"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCalcCombo(c)}
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                          calcCombo === c
                            ? "bg-fuchsia-500 text-white shadow-sm"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-pink-200 mb-1">
                      {calcCombo === "D01" ? "Ngữ Văn" : "Toán"}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={mathScore}
                      onChange={(e) => setMathScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:bg-white focus:text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-pink-200 mb-1">
                      {calcCombo === "A00" ? "Vật lý" : calcCombo === "A01" ? "Vật lý" : "Toán"}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={physicsScore}
                      onChange={(e) => setPhysicsScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:bg-white focus:text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-pink-200 mb-1">
                      {calcCombo === "A00" ? "Hóa học" : "Tiếng Anh"}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={chemOrEngScore}
                      onChange={(e) => setChemOrEngScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:bg-white focus:text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right col: Calculation Result */}
            <div className="lg:col-span-6 bg-white rounded-2xl text-gray-900 p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Tổng điểm tổ hợp {calcCombo}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-fuchsia-600 font-mono">
                    {totalCalcScore} <span className="text-sm font-normal text-gray-400">/ 30.00</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    {Number(totalCalcScore) >= 24 ? "✓ Rất Triển Vọng" : "Khả Quan"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700">
                  Gợi ý ngành phù hợp với mức điểm của bạn:
                </p>
                <div className="space-y-1.5 text-xs">
                  {Number(totalCalcScore) >= 26 && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-between">
                      <span className="font-semibold">Trí tuệ Nhân tạo & Data Science (Chuẩn 26.5)</span>
                      <span className="text-emerald-700 font-bold">Đủ điều kiện</span>
                    </div>
                  )}
                  {Number(totalCalcScore) >= 24.5 && (
                    <div className="p-2.5 rounded-xl bg-pink-50 text-fuchsia-900 flex items-center justify-between">
                      <span className="font-semibold">Công nghệ Thông tin (Chuẩn 25.0)</span>
                      <span className="text-fuchsia-700 font-bold">Đủ điều kiện</span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-violet-50 text-violet-900 flex items-center justify-between">
                    <span className="font-semibold">Quản trị Kinh doanh / Marketing (Chuẩn 23.0)</span>
                    <span className="text-violet-700 font-bold">Đủ điều kiện</span>
                  </div>
                </div>
              </div>

              <Link
                to={isAuthenticated ? "/user/apply" : "/register"}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Nộp hồ sơ ngay với mức điểm này</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Form Đăng Ký Tư Vấn Trực Tiếp (Lead Generator) */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              Đồng hành cùng bạn
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Đăng Ký Nhận Tư Vấn Tuyển Sinh 1-1 Miễn Phí
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Để lại thông tin để cán bộ tư vấn tuyển sinh liên hệ hỗ trợ hướng dẫn
              chi tiết quy chế, tính điểm học bạ và xét học bổng.
            </p>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            {leadSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Đăng ký tư vấn thành công!</h4>
                <p className="text-xs text-emerald-700">
                  Cán bộ phụ trách sẽ liên hệ qua số điện thoại của bạn trong vòng 24 giờ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Họ và tên thí sinh *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ví dụ: Trần Minh Hoàng"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Địa chỉ Email (nếu có)
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Ngành bạn đang quan tâm
                    </label>
                    <select
                      value={leadMajor}
                      onChange={(e) => setLeadMajor(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 shadow-2xs cursor-pointer"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Thông Tin Nhận Tư Vấn</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. Hỏi Đáp Thường Gặp (FAQ) */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Câu Hỏi Thường Gặp Về Tuyển Sinh 2026
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-fuchsia-600 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-fuchsia-600" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-900 text-gray-400 text-xs py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-pink-400" />
              <span>ĐẠI HỌC TUYỂN SINH 2026</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Hệ thống cổng thông tin tuyển sinh đại học trực tuyến và trợ lý AI
              hỗ trợ giải đáp, nhận hồ sơ xét tuyển sớm 2026.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Thông tin tuyển sinh
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#nganh-dao-tao" className="hover:text-white transition">Ngành đào tạo & Điểm chuẩn</a></li>
              <li><a href="#phuong-thuc" className="hover:text-white transition">Quy chế & Phương thức xét tuyển</a></li>
              <li><a href="#tinh-diem" className="hover:text-white transition">Công cụ tính điểm học bạ</a></li>
              <li><Link to="/register" className="hover:text-white transition">Nộp hồ sơ trực tuyến</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Cổng liên kết
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/login" className="hover:text-white transition">Đăng nhập tài khoản</Link></li>
              <li><Link to="/user" className="hover:text-white transition">Cổng hồ sơ thí sinh</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Cổng quản trị viên (Admin)</Link></li>
              <li><Link to="/chatbot" className="hover:text-white transition">Trợ lý AI tuyển sinh</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Liên hệ hội đồng tuyển sinh
            </h4>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              <span>Hotline: 1900 6868 (Phím 1)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span>tuyensinh2026@admission.edu.vn</span>
            </div>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
              <span>Khu Đô thị Đại học, TP. Hồ Chí Minh & Hà Nội</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center text-[10px] text-gray-500">
          © 2026 Bản quyền thuộc về Hội đồng Tuyển sinh Đại học. Hệ thống tích hợp Chatbot AI Tuyển sinh.
        </div>
      </footer>
    </div>
  );
}
