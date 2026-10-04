import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  CreditCard,
  Bot,
  ArrowRight,
  FileText,
  Sparkles,
  Phone,
  Mail,
  Award,
  Download,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { admissionService } from '../../services/adminssion.service';
import { UNIVERSITY_INFO } from '../../constants/adminssion';
import { formatCurrencyVND, formatDate } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import type { Student, Payment, Course } from '../../types';

export default function UserDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    // Look up student by email or candidate code or default
    const allStudents = admissionService.getStudents();
    const currentEmail = user?.email || 'user@admission.edu.vn';
    const found =
      allStudents.find(
        (s) =>
          s.email.toLowerCase() === currentEmail.toLowerCase() ||
          s.candidateCode === user?.candidateCode
      ) || allStudents[allStudents.length - 1]; // fallback to last student demo

    setStudent(found || null);

    const allPayments = admissionService.getPayments();
    const userPayments = allPayments.filter(
      (p) =>
        p.candidateCode === found?.candidateCode ||
        (p.candidateName && found?.fullName && p.candidateName.toLowerCase().includes(found.fullName.toLowerCase())) ||
        (p.studentName && found?.fullName && p.studentName.toLowerCase().includes(found.fullName.toLowerCase()))
    );
    setPayments(userPayments.length > 0 ? userPayments : [allPayments[0]]);

    setCourses(admissionService.getCourses());
  }, [user]);

  const steps = [
    { title: 'Tạo tài khoản', desc: 'Đã hoàn tất', completed: true, active: false },
    { title: 'Nộp hồ sơ online', desc: 'Học bạ & CCCD', completed: true, active: false },
    { title: 'Hội đồng thẩm định', desc: 'Đã kiểm tra hồ sơ', completed: true, active: false },
    {
      title: 'Thông báo kết quả',
      desc: student?.applicationStatus === 'accepted' ? 'Đã trúng tuyển' : 'Đang xét duyệt',
      completed: student?.applicationStatus === 'accepted',
      active: student?.applicationStatus !== 'accepted',
    },
    { title: 'Xác nhận nhập học', desc: 'Đóng tạm thu học phí', completed: false, active: true },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Hệ thống Tuyển sinh Đại học Chính quy năm {UNIVERSITY_INFO.admissionYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Xin chào, {student?.fullName || user?.fullName || 'Thí sinh'}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Chào mừng bạn đến với Cổng thông tin Thí sinh. Bạn có thể theo dõi tiến độ xét duyệt hồ sơ, xem kết quả trúng tuyển và thanh toán lệ phí trực tuyến tại đây.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200 font-mono">
              <span>Mã thí sinh: <strong className="text-white">{student?.candidateCode || 'TS2026-88991'}</strong></span>
              <span>•</span>
              <span>CCCD: <strong className="text-white">{student?.cccd || '079208009988'}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/user/apply"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-xs sm:text-sm hover:bg-blue-50 transition shadow-sm"
            >
              <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
              <span>Nộp Thêm Nguyện Vọng</span>
            </Link>
            <Link
              to="/user/chat"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition"
            >
              <Bot className="w-4.5 h-4.5" />
              <span>Trợ Lý AI Tư Vấn</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Step Admission Progress Pipeline */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">
          Tiến Độ Hồ Sơ Xét Tuyển Trực Tuyến
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                step.completed
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : step.active
                  ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Bước 0{idx + 1}
                </span>
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : step.active ? (
                  <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300" />
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">{step.title}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Application Card & Right Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Candidate Application Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Result Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs relative overflow-hidden">
            {/* Accepted highlight badge */}
            {student?.applicationStatus === 'accepted' && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl mb-5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-100" />
                  <span className="text-xs sm:text-sm font-bold">
                    CHÚC MỪNG! BẠN ĐÃ ĐỦ ĐIỀU KIỆN TRÚNG TUYỂN SỚM
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-50 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xem Giấy Báo</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <span className="text-[11px] font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                  Mã Ngành: {student?.majorCode || '7480201'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Nguyện Vọng 1: {student?.majorName || 'Công nghệ Thông tin'}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {student?.applicationStatus === 'accepted' ? 'Đã Trúng Tuyển' : 'Đang Thẩm Định'}
                </span>
                <p className="text-[11px] text-gray-400 mt-1">
                  Ngày nộp: {formatDate(student?.submissionDate || '2026-09-16')}
                </p>
              </div>
            </div>

            {/* Application details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Phương thức xét</span>
                <strong className="text-gray-900 font-semibold">
                  {student?.admissionMethod === 'hoc_ba' ? 'Học bạ THPT' : 'Điểm thi THPT'}
                </strong>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Điểm xét tuyển</span>
                <strong className="text-blue-600 font-bold text-base">
                  {student?.totalScore || 26.8} / 30.0
                </strong>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Trường THPT</span>
                <strong className="text-gray-900 font-medium">
                  {student?.highSchool || 'THPT Chu Văn An'}
                </strong>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Lệ phí xét tuyển</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã đóng đủ
                </span>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Hạn chót xác nhận nhập học trực tuyến và nộp bản chính Giấy chứng nhận tốt nghiệp THPT trước ngày{' '}
                <strong className="text-red-600">30/08/2026</strong>.
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Giấy Báo</span>
                </button>
                <Link
                  to="/user/payments"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Xác Nhận Nhập Học</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Payment History Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Biên Lai & Lệ Phí Đã Nộp</h3>
                <p className="text-xs text-gray-500">Đối soát trực tuyến qua cổng thanh toán VNPay / MoMo</p>
              </div>
              <Link
                to="/user/payments"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {payments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {p.paymentType === 'le_phi_xet_tuyen'
                          ? 'Lệ phí xét tuyển hồ sơ đại học'
                          : 'Học phí tạm thu'}
                      </p>
                      <span className="text-[11px] font-mono text-gray-400">
                        Mã GD: {p.transactionCode} • Cổng {p.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrencyVND(p.amount)}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Đã thanh toán
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Counselor Contact & Suggested Majors */}
        <div className="space-y-6">
          {/* Dedicated Counselor Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Cán Bộ Hỗ Trợ Riêng</span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                H
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight">
                  PGS.TS. Trần Đình Hoàng
                </h4>
                <p className="text-xs text-blue-600 font-medium">Ban Tư Vấn Tuyển Sinh Khối CNTT</p>
                <p className="text-[11px] text-gray-400">Khoa Công nghệ Thông tin</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Phone className="w-3.5 h-3.5" /> Hotline trực tiếp:
                </span>
                <strong className="text-gray-900">0903 889 901</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Mail className="w-3.5 h-3.5" /> Email giải đáp:
                </span>
                <span className="text-blue-600 font-medium truncate max-w-[160px]">
                  hoang.td@admission.edu.vn
                </span>
              </div>
            </div>

            <Link
              to="/user/chat"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition border border-blue-200/60"
            >
              <Bot className="w-4 h-4" />
              <span>Nhắn tin hỏi Trợ lý AI ngay</span>
            </Link>
          </div>

          {/* Admission Schedule */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Lịch Tuyển Sinh Quan Trọng</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Xét học bạ đợt 1</p>
                  <p className="text-gray-500 text-[11px]">Từ 01/03 đến hết 30/05/2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Công bố điểm chuẩn trúng tuyển sớm</p>
                  <p className="text-gray-500 text-[11px]">Ngày 15/06/2026 trên Cổng thí sinh</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Xác nhận nhập học & nộp học phí</p>
                  <p className="text-gray-500 text-[11px]">Trước 17h00 ngày 30/08/2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Major Inquiry */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Các Ngành Đào Tạo Khác
              </span>
              <Link to="/user/majors" className="text-xs text-blue-600 font-semibold hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-2">
              {courses.slice(1, 4).map((c) => (
                <Link
                  key={c.id}
                  to="/user/majors"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition group"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600">
                      {c.name}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      Điểm chuẩn: {c.previousCutoffScore} • {formatCurrencyVND(c.tuitionPerTerm)}/kỳ
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Giấy Báo Trúng Tuyển Điện Tử */}
      <Modal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        title="GIẤY BÁO ĐỦ ĐIỀU KIỆN TRÚNG TUYỂN (BẢN ĐIỆN TỬ)"
        maxWidth="lg"
      >
        <div className="space-y-6 text-xs text-gray-800 p-2">
          <div className="text-center border-b border-gray-200 pb-5">
            <p className="text-xs uppercase font-bold text-gray-500">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
            <h2 className="text-base font-extrabold text-blue-900 mt-1 uppercase">
              {UNIVERSITY_INFO.name}
            </h2>
            <p className="text-[11px] text-gray-500">HỘI ĐỒNG TUYỂN SINH ĐẠI HỌC CHÍNH QUY NĂM 2026</p>
            <div className="w-24 h-0.5 bg-blue-600 mx-auto my-2"></div>
            <h3 className="text-base font-bold text-red-600 mt-3">
              GIẤY BÁO ĐỦ ĐIỀU KIỆN TRÚNG TUYỂN SỚM
            </h3>
            <p className="text-[11px] italic text-gray-400">Số: 2026/GBTT-NTU</p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200/80 leading-relaxed">
            <p>
              Hội đồng tuyển sinh <strong>{UNIVERSITY_INFO.name}</strong> trân trọng thông báo thí sinh:
            </p>
            <div className="grid grid-cols-2 gap-2 font-medium">
              <div>• Họ và tên: <strong>{student?.fullName}</strong></div>
              <div>• Giới tính: <strong>{student?.gender}</strong></div>
              <div>• Ngày sinh: <strong>{student?.birthDate}</strong></div>
              <div>• Số CCCD: <strong>{student?.cccd}</strong></div>
              <div>• Mã thí sinh: <strong>{student?.candidateCode}</strong></div>
              <div>• Trường THPT: <strong>{student?.highSchool}</strong></div>
            </div>
            <p className="pt-2">
              Đã đủ điều kiện trúng tuyển vào ngành đào tạo chính quy:
            </p>
            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
              🎯 Ngành: <strong>{student?.majorName}</strong> (Mã ngành: {student?.majorCode})<br />
              📊 Điểm xét tuyển: <strong>{student?.totalScore} điểm</strong> (Điểm chuẩn: 25.75)
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400 italic">
              * Thí sinh chỉ cần tốt nghiệp THPT để chính thức nhập học.
            </span>
            <button
              type="button"
              onClick={() => {
                alert('Đang tải giấy báo trúng tuyển bản PDF có chữ ký số và dấu đỏ...');
                setShowCertificateModal(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bản PDF Có Dấu Đỏ</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
