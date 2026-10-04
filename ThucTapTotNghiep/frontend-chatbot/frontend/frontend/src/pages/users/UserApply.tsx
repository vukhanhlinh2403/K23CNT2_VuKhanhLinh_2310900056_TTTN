import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  FileUp,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { admissionService } from '../../services/adminssion.service';
import { INITIAL_COURSES } from '../../constants/adminssion';
import type { Student } from '../../types';

export default function UserApply() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nguyễn Thí Sinh',
    cccd: '079208009988',
    phone: user?.phone || '0988776655',
    email: user?.email || 'user@admission.edu.vn',
    gender: 'Nam' as 'Nam' | 'Nữ',
    birthDate: '2008-07-20',
    highSchool: 'THPT Chu Văn An',
    province: 'Hà Nội',
    majorCode: '7480201',
    majorName: 'Công nghệ Thông tin',
    admissionMethod: 'hoc_ba' as 'hoc_ba' | 'thpt' | 'dgnl' | 'tuyen_thang',
    subject1: 9.0,
    subject2: 8.8,
    subject3: 9.2,
    fileAttached: true,
  });

  const selectedCourse = INITIAL_COURSES.find((c) => c.code === formData.majorCode) || INITIAL_COURSES[0];
  const totalScore = Number((formData.subject1 + formData.subject2 + formData.subject3).toFixed(2));

  const handleMajorChange = (code: string) => {
    const course = INITIAL_COURSES.find((c) => c.code === code);
    if (course) {
      setFormData({
        ...formData,
        majorCode: course.code,
        majorName: course.name,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      candidateCode: user?.candidateCode || `TS2026-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: formData.fullName,
      cccd: formData.cccd,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthDate: formData.birthDate,
      highSchool: formData.highSchool,
      majorCode: formData.majorCode,
      majorName: formData.majorName,
      admissionMethod: formData.admissionMethod,
      totalScore,
      applicationStatus: totalScore >= (selectedCourse.previousCutoffScore || 24) ? 'accepted' : 'submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid',
    };

    admissionService.saveStudent(newStudent);

    // Also register lead
    admissionService.saveLead({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      desiredMajor: formData.majorName,
      highSchool: formData.highSchool,
      province: formData.province,
      expectedScore: totalScore,
      status: 'registered',
      source: 'landing_page',
      notes: `Thí sinh nộp hồ sơ xét tuyển trực tuyến ngành ${formData.majorName}`,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center space-y-5 my-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ĐÃ NỘP HỒ SƠ THÀNH CÔNG
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Hồ Sơ Xét Tuyển Đại Học Của Bạn Đã Được Ghi Nhận!
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            Hệ thống đã tiếp nhận nguyện vọng ngành <strong>{formData.majorName}</strong> với tổng điểm xét tuyển{' '}
            <strong className="text-blue-600">{totalScore} điểm</strong>.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã thí sinh:</span>
            <strong className="font-mono text-gray-900">{user?.candidateCode || 'TS2026-88991'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngành đăng ký:</span>
            <strong className="text-gray-900">{formData.majorName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phương thức:</span>
            <strong className="text-gray-900">
              {formData.admissionMethod === 'hoc_ba' ? 'Xét học bạ THPT' : 'Điểm thi THPT'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tình trạng xét tuyển:</span>
            <span className="text-emerald-600 font-bold">
              {totalScore >= selectedCourse.previousCutoffScore ? 'Đủ điều kiện trúng tuyển sớm' : 'Đang thẩm định'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Về Trang Tổng Quan Hồ Sơ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Xét Tuyển Sớm Năm 2026</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Nộp Hồ Sơ Xét Tuyển Đại Học Trực Tuyến
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Điền thông tin học lực và kết quả học bạ lớp 12 hoặc điểm thi tốt nghiệp THPT để nhận kết quả xét tuyển tức thì
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Candidate Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
              1
            </span>
            <span>Thông Tin Cá Nhân Thí Sinh</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Họ và tên thí sinh *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số CCCD / Hộ chiếu *</label>
              <input
                type="text"
                required
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số điện thoại liên lạc *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email nhận thông báo *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Trường THPT *</label>
              <input
                type="text"
                required
                value={formData.highSchool}
                onChange={(e) => setFormData({ ...formData, highSchool: e.target.value })}
                placeholder="THPT Chu Văn An"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tỉnh / Thành phố *</label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Choose Major & Method */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
              2
            </span>
            <span>Chọn Nguyện Vọng Ngành Đào Tạo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Ngành xét tuyển ưu tiên *</label>
              <select
                value={formData.majorCode}
                onChange={(e) => handleMajorChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                {INITIAL_COURSES.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.name} ({c.code}) - Điểm chuẩn: {c.previousCutoffScore}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Phương thức xét tuyển *</label>
              <select
                value={formData.admissionMethod}
                onChange={(e) => setFormData({ ...formData, admissionMethod: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="hoc_ba">Xét điểm Học bạ THPT (Tổ hợp 3 môn)</option>
                <option value="thpt">Xét điểm thi Tốt nghiệp THPT 2026</option>
                <option value="dgnl">Xét điểm thi Đánh giá Năng lực ĐHQG</option>
                <option value="tuyen_thang">Tuyển thẳng & Ưu tiên xét tuyển</option>
              </select>
            </div>
          </div>

          {/* Major Spotlight Info */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-blue-900">{selectedCourse.name}</p>
              <p className="text-gray-600 text-[11px] mt-0.5">{selectedCourse.description}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] text-gray-500">Tổ hợp môn:</span>
              <p className="font-mono font-bold text-blue-700">{selectedCourse.subjectGroups.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Subject Scores */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
              3
            </span>
            <span>Nhập Điểm 3 Môn Thuộc Tổ Hợp Xét Tuyển</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Môn 1 (Toán) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.subject1}
                onChange={(e) => setFormData({ ...formData, subject1: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Môn 2 (Lý / Văn) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.subject2}
                onChange={(e) => setFormData({ ...formData, subject2: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Môn 3 (Hóa / Tiếng Anh) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.subject3}
                onChange={(e) => setFormData({ ...formData, subject3: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">Tổng điểm xét tuyển dự kiến:</span>
              <p className="text-xl font-extrabold text-blue-600 mt-0.5">{totalScore} / 30.0</p>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px]">Điểm chuẩn năm trước:</span>
              <p className="font-bold text-gray-800">{selectedCourse.previousCutoffScore} điểm</p>
            </div>
          </div>

          {/* File attachment box */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gray-50/50 hover:bg-white transition cursor-pointer">
            <FileUp className="w-7 h-7 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-800">
              Đính kèm bản chụp Học bạ THPT & Mặt trước CCCD
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Hỗ trợ file PDF, JPG, PNG dung lượng tối đa 15MB
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-medium">
              ✓ Đã tự động liên kết tài liệu từ hồ sơ của bạn
            </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 font-medium text-xs transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <span>Xác Nhận Nộp Hồ Sơ Xét Tuyển</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
