import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  FileText,
  Edit2,
  Trash2,
  Filter,
  CheckCheck
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { formatAdmissionMethod, formatApplicationStatus } from '../../utils/formatters';
import type { Student } from '../../types';

function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<Student>({
    id: '',
    candidateCode: '',
    fullName: '',
    cccd: '',
    email: '',
    phone: '',
    gender: 'Nam',
    birthDate: '2008-01-01',
    highSchool: '',
    majorCode: '7480201',
    majorName: 'Công nghệ Thông tin',
    admissionMethod: 'hoc_ba',
    totalScore: 25.5,
    applicationStatus: 'submitted',
    submissionDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'unpaid',
  });

  const loadData = () => {
    setStudents(admissionService.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      id: `std-${Date.now()}`,
      candidateCode: `TS2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: '',
      cccd: '',
      email: '',
      phone: '',
      gender: 'Nam',
      birthDate: '2008-05-15',
      highSchool: '',
      majorCode: '7480201',
      majorName: 'Công nghệ Thông tin',
      admissionMethod: 'hoc_ba',
      totalScore: 26.0,
      applicationStatus: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'unpaid',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Student) => {
    setEditingStudent(s);
    setFormData(s);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ thí sinh này?')) {
      admissionService.deleteStudent(id);
      loadData();
    }
  };

  const handleAcceptCandidate = (s: Student) => {
    admissionService.saveStudent({
      ...s,
      applicationStatus: 'accepted',
    });
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập họ tên và số điện thoại');
      return;
    }

    admissionService.saveStudent(formData);
    setIsModalOpen(false);
    loadData();
  };

  const filteredStudents = students.filter((s) => {
    const matchText =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.candidateCode.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.cccd.includes(search);
    const matchStatus = statusFilter === 'all' || s.applicationStatus === statusFilter;
    return matchText && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản Lý Hồ Sơ Thí Sinh Xét Tuyển (Students)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi, thẩm định và phê duyệt kết quả xét tuyển đại học năm 2026
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tiếp Nhận Hồ Sơ Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã thí sinh, CCCD, SĐT..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả ({students.length})</option>
            <option value="submitted">Đã tiếp nhận</option>
            <option value="validating">Đang thẩm định</option>
            <option value="accepted">Đã trúng tuyển</option>
            <option value="enrolled">Đã nhập học</option>
            <option value="rejected">Không trúng tuyển</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Mã TS / Họ tên</th>
                <th className="px-6 py-3.5">Ngành đăng ký</th>
                <th className="px-6 py-3.5">Phương thức / Điểm</th>
                <th className="px-6 py-3.5">Liên hệ</th>
                <th className="px-6 py-3.5">Lệ phí</th>
                <th className="px-6 py-3.5">Tình trạng hồ sơ</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const statusInfo = formatApplicationStatus(s.applicationStatus);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="leading-tight">{s.fullName}</p>
                            <span className="text-[11px] font-mono text-gray-400 font-normal">
                              {s.candidateCode} • {s.gender}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 leading-tight">{s.majorName}</p>
                        <span className="text-[11px] text-gray-400">Mã: {s.majorCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{formatAdmissionMethod(s.admissionMethod)}</p>
                        <p className="text-[11px] text-gray-500">
                          Điểm xét: <strong className="text-blue-600 font-bold">{s.totalScore}</strong>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <p>{s.phone}</p>
                        <p className="text-[11px] text-gray-400">{s.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            s.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {s.paymentStatus === 'paid' ? 'Đã nộp lệ phí' : 'Chưa nộp'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.applicationStatus !== 'accepted' && (
                            <button
                              type="button"
                              onClick={() => handleAcceptCandidate(s)}
                              title="Duyệt trúng tuyển"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(s)}
                            title="Sửa hồ sơ"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            title="Xóa hồ sơ"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy hồ sơ thí sinh nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Chỉnh Sửa Hồ Sơ Thí Sinh' : 'Tiếp Nhận Hồ Sơ Thí Sinh Mới'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mã thí sinh</label>
              <input
                type="text"
                readOnly
                value={formData.candidateCode}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 font-mono text-gray-600"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số CCCD</label>
              <input
                type="text"
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                placeholder="079..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Ngành xét tuyển</label>
              <select
                value={formData.majorName}
                onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                <option value="Trí tuệ Nhân tạo (AI & Data Science)">Trí tuệ Nhân tạo (AI & Data Science)</option>
                <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                <option value="Digital Marketing (Marketing Số)">Digital Marketing (Marketing Số)</option>
                <option value="Thiết kế Đồ họa & Truyền thông Đa phương tiện">Thiết kế Đồ họa & Truyền thông Đa phương tiện</option>
                <option value="Ngôn ngữ Anh (Biên phiên dịch & Thương mại)">Ngôn ngữ Anh (Biên phiên dịch & Thương mại)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Phương thức xét tuyển</label>
              <select
                value={formData.admissionMethod}
                onChange={(e) => setFormData({ ...formData, admissionMethod: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="hoc_ba">Xét học bạ THPT</option>
                <option value="thpt">Điểm thi Tốt nghiệp THPT</option>
                <option value="dgnl">Kỳ thi Đánh giá năng lực ĐHQG</option>
                <option value="tuyen_thang">Tuyển thẳng & Ưu tiên</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tổng điểm xét tuyển</label>
              <input
                type="number"
                step="0.05"
                value={formData.totalScore}
                onChange={(e) => setFormData({ ...formData, totalScore: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tình trạng hồ sơ</label>
              <select
                value={formData.applicationStatus}
                onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="submitted">Đã tiếp nhận</option>
                <option value="validating">Đang thẩm định</option>
                <option value="accepted">Đã trúng tuyển</option>
                <option value="enrolled">Đã nhập học</option>
                <option value="rejected">Không trúng tuyển</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Lệ phí xét tuyển</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 font-medium transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              {editingStudent ? 'Cập nhật hồ sơ' : 'Lưu Hồ Sơ Thí Sinh'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StudentsList;
