import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Award
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import type { Teacher } from '../../types';

function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Teacher>({
    id: '',
    fullName: '',
    title: 'ThS.',
    department: 'Ban Tuyển Sinh & Truyền Thông',
    email: '',
    phone: '',
    assignedMajors: ['Công nghệ Thông tin'],
    status: 'active',
  });

  const loadData = () => {
    setTeachers(admissionService.getTeachers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      id: `tch-${Date.now()}`,
      fullName: '',
      title: 'ThS.',
      department: 'Ban Tuyển Sinh & Truyền Thông',
      email: '',
      phone: '',
      assignedMajors: ['Công nghệ Thông tin'],
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData(t);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cán bộ tư vấn này?')) {
      admissionService.deleteTeacher(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập họ tên và số điện thoại cán bộ tư vấn');
      return;
    }

    admissionService.saveTeacher(formData);
    setIsModalOpen(false);
    loadData();
  };

  const filteredTeachers = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Ban Tư Vấn Tuyển Sinh (Advisors & Teachers)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Phân công chuyên viên và giảng viên phụ trách giải đáp thí sinh theo từng nhóm ngành
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Cán Bộ Tư Vấn</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên cán bộ, email, số điện thoại..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
          Tổng cộng: <strong>{filteredTeachers.length}</strong> cán bộ
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {t.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      {t.title || ''} {t.fullName}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t.department}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'active' || !t.status ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {t.status === 'active' || !t.status ? 'Sẵn sàng' : 'Bận'}
                </span>
              </div>

              <div className="space-y-1.5 py-3 border-t border-b border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Award className="w-3 h-3 text-blue-600" />
                  <span>Ngành phụ trách tư vấn</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(t.assignedMajors || ['Tư vấn chung']).map((m: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[11px] font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-4 mt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleOpenEditModal(t)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                title="Sửa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Chỉnh Sửa Cán Bộ Tư Vấn' : 'Thêm Cán Bộ Tư Vấn Mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Học hàm / Học vị</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="ThS.">ThS.</option>
                <option value="TS.">TS.</option>
                <option value="PGS.TS.">PGS.TS.</option>
                <option value="GS.TS.">GS.TS.</option>
                <option value="Chuyên viên">Chuyên viên</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Họ và tên cán bộ *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Thị B"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email công vụ</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tuyensinh@admission.edu.vn"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Phòng ban / Khoa</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Ngành phụ trách (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={(formData.assignedMajors || []).join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assignedMajors: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="Công nghệ Thông tin, AI..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              {editingTeacher ? 'Cập nhật' : 'Thêm Cán Bộ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeachersList;
