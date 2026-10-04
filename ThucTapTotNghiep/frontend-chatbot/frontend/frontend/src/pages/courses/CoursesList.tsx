import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { formatCurrencyVND } from '../../utils/formatters';
import type { Course } from '../../types';

function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState<Course>({
    id: '',
    code: '',
    name: '',
    faculty: 'Khoa Công nghệ Thông tin',
    quota: 300,
    tuitionPerTerm: 18000000,
    durationYears: 4,
    subjectGroups: ['A00', 'A01', 'D01'],
    previousCutoffScore: 24.5,
    description: '',
    careerOpportunities: [],
  });

  const loadData = () => {
    setCourses(admissionService.getCourses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      id: `crs-${Date.now()}`,
      code: '7480201',
      name: '',
      faculty: 'Khoa Công nghệ Thông tin',
      quota: 250,
      tuitionPerTerm: 18000000,
      durationYears: 4,
      subjectGroups: ['A00', 'A01', 'D01'],
      previousCutoffScore: 24.0,
      description: '',
      careerOpportunities: ['Chuyên viên', 'Kỹ sư'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngành học này?')) {
      admissionService.deleteCourse(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Vui lòng nhập mã ngành và tên ngành');
      return;
    }

    admissionService.saveCourse(formData);
    setIsModalOpen(false);
    loadData();
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search) ||
    c.faculty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản Lý Ngành Đào Tạo (Courses)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập danh mục ngành, chỉ tiêu, tổ hợp xét tuyển và mức học phí tích hợp AI tư vấn
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Ngành Mới</span>
        </button>
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
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
          Tổng cộng: <strong>{filteredCourses.length}</strong> ngành đào tạo
        </span>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                  Mã: {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Điểm chuẩn: {c.previousCutoffScore}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">
                {c.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{c.faculty}</p>

              <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
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
                    <Award className="w-3.5 h-3.5" /> Học phí dự kiến:
                  </span>
                  <strong className="text-blue-600 font-semibold">{formatCurrencyVND(c.tuitionPerTerm)}/kỳ</strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Layers className="w-3.5 h-3.5" /> Tổ hợp xét tuyển:
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

            <div className="flex items-center justify-between pt-4 mt-2">
              <span className="text-[11px] text-gray-400">Thời gian: {c.durationYears} năm</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(c)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="Sửa ngành"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Xóa ngành"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Chỉnh Sửa Ngành Đào Tạo' : 'Thêm Ngành Đào Tạo Mới'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mã ngành *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="7480201"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tên ngành *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Công nghệ Thông tin"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Khoa phụ trách</label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Chỉ tiêu SV</label>
              <input
                type="number"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Điểm chuẩn năm trước</label>
              <input
                type="number"
                step="0.05"
                value={formData.previousCutoffScore}
                onChange={(e) => setFormData({ ...formData, previousCutoffScore: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Học phí 1 kỳ (VNĐ)</label>
              <input
                type="number"
                step="500000"
                value={formData.tuitionPerTerm}
                onChange={(e) => setFormData({ ...formData, tuitionPerTerm: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tổ hợp môn (cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={formData.subjectGroups.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectGroups: e.target.value.split(',').map((s) => s.trim().toUpperCase()),
                  })
                }
                placeholder="A00, A01, D01"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Mô tả chương trình đào tạo</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giới thiệu định hướng đào tạo, công nghệ, chứng chỉ quốc tế..."
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
              {editingCourse ? 'Cập nhật' : 'Lưu Ngành Mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CoursesList;
