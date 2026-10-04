import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { formatDate, formatLeadStatus } from '../../utils/formatters';
import type { Lead } from '../../types';

function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Lead>>({
    fullName: '',
    phone: '',
    email: '',
    desiredMajor: 'Công nghệ Thông tin',
    highSchool: '',
    province: 'TP. Hồ Chí Minh',
    expectedScore: 24,
    notes: '',
    status: 'new',
    source: 'chatbot',
  });

  const loadData = () => {
    setLeads(admissionService.getLeads());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      desiredMajor: 'Công nghệ Thông tin',
      highSchool: '',
      province: 'TP. Hồ Chí Minh',
      expectedScore: 24,
      notes: '',
      status: 'new',
      source: 'chatbot',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thí sinh này?')) {
      admissionService.deleteLead(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập họ tên và số điện thoại');
      return;
    }

    admissionService.saveLead({
      ...(editingLead ? { id: editingLead.id } : {}),
      ...formData,
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleConvertToStudent = (lead: Lead) => {
    admissionService.saveStudent({
      id: `std-${Date.now()}`,
      candidateCode: `TS2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: lead.fullName,
      cccd: '079208009988',
      email: lead.email || 'student@admission.edu.vn',
      phone: lead.phone,
      gender: 'Nam',
      birthDate: '2008-01-01',
      highSchool: lead.highSchool || 'THPT Toàn Quốc',
      majorCode: '7480201',
      majorName: lead.desiredMajor,
      admissionMethod: 'hoc_ba',
      totalScore: lead.expectedScore || 25,
      applicationStatus: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'unpaid',
    });

    admissionService.saveLead({
      ...lead,
      status: 'registered',
      notes: (lead.notes || '') + ' [Đã tạo hồ sơ xét tuyển]',
    });

    loadData();
    alert(`Đã chuyển thí sinh ${lead.fullName} thành hồ sơ xét tuyển thành công!`);
  };

  const filteredLeads = leads.filter((l) => {
    const matchQuery =
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.desiredMajor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản Lý Thí Sinh Tiềm Năng (Leads)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp dữ liệu thí sinh quan tâm từ Chatbot AI, biểu mẫu đăng ký và các kênh tư vấn
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thí Sinh Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, ngành quan tâm..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-fuchsia-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-fuchsia-500"
          >
            <option value="all">Tất cả ({leads.length})</option>
            <option value="new">Mới đăng ký</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="counseled">Đã tư vấn</option>
            <option value="registered">Đã nộp hồ sơ</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Họ và tên</th>
                <th className="px-6 py-3.5">Liên hệ</th>
                <th className="px-6 py-3.5">Ngành quan tâm</th>
                <th className="px-6 py-3.5">Trường / Tỉnh</th>
                <th className="px-6 py-3.5">Nguồn</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const statusInfo = formatLeadStatus(lead.status);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-fuchsia-700 flex items-center justify-center font-bold text-xs">
                            {lead.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="leading-tight">{lead.fullName}</p>
                            <p className="text-[11px] font-normal text-gray-400 mt-0.5">
                              {formatDate(lead.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{lead.phone}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        <p className="leading-tight">{lead.desiredMajor}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Điểm dự kiến: <strong className="text-fuchsia-600">{lead.expectedScore}</strong>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <p>{lead.highSchool || '---'}</p>
                        <p className="text-[11px] text-gray-400">{lead.province}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={lead.source === 'chatbot' ? 'blue' : 'gray'}>
                          {lead.source === 'chatbot' ? 'Chatbox AI' : lead.source}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.status !== 'registered' && (
                            <button
                              type="button"
                              onClick={() => handleConvertToStudent(lead)}
                              title="Tạo hồ sơ xét tuyển"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(lead)}
                            title="Sửa thông tin"
                            className="p-1.5 text-fuchsia-600 hover:bg-pink-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lead.id)}
                            title="Xóa"
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
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy thí sinh nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? 'Chỉnh Sửa Thí Sinh' : 'Thêm Thí Sinh Tiềm Năng Mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Điểm dự kiến</label>
              <input
                type="number"
                step="0.1"
                value={formData.expectedScore}
                onChange={(e) => setFormData({ ...formData, expectedScore: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Ngành quan tâm</label>
              <select
                value={formData.desiredMajor}
                onChange={(e) => setFormData({ ...formData, desiredMajor: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
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
              <label className="block font-medium text-gray-700 mb-1">Trạng thái tư vấn</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="new">Mới đăng ký</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="counseled">Đã tư vấn</option>
                <option value="registered">Đã nộp hồ sơ</option>
                <option value="cancelled">Đã hủy / Không có nhu cầu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Trường THPT</label>
              <input
                type="text"
                value={formData.highSchool}
                onChange={(e) => setFormData({ ...formData, highSchool: e.target.value })}
                placeholder="THPT Chuyên..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="TP. Hồ Chí Minh"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Ghi chú tư vấn</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú chi tiết về nhu cầu học bổng, câu hỏi của thí sinh..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
            />
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
              className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              {editingLead ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LeadsList;
