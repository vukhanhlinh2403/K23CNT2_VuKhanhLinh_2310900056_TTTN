import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import type { ClassBatch } from '../../types';

function ClassesList() {
  const [classes, setClasses] = useState<ClassBatch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ClassBatch | null>(null);

  const [formData, setFormData] = useState<ClassBatch>({
    id: '',
    code: '',
    name: '',
    round: 'Đợt 1',
    courseCode: 'ALL',
    courseName: 'Tất cả các ngành đào tạo',
    startDate: '2026-03-01',
    endDate: '2026-05-30',
    targetQuota: 500,
    registeredCount: 0,
    status: 'open',
  });

  const loadData = () => {
    setClasses(admissionService.getClasses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBatch(null);
    setFormData({
      id: `cls-${Date.now()}`,
      code: `DOT-2026-0${classes.length + 1}`,
      name: '',
      round: `Đợt ${classes.length + 1}`,
      courseCode: 'ALL',
      courseName: 'Tất cả các ngành đào tạo',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-07-31',
      targetQuota: 600,
      registeredCount: 0,
      status: 'open',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: ClassBatch) => {
    setEditingBatch(b);
    setFormData(b);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt tuyển sinh này?')) {
      admissionService.deleteClass(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Vui lòng nhập tên đợt tuyển sinh và mã đợt');
      return;
    }

    admissionService.saveClass(formData);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản Lý Đợt Tuyển Sinh & Lớp Xét Tuyển (Classes)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tiến độ nhận hồ sơ theo từng đợt (Học bạ, ĐGNL, Tốt nghiệp THPT)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Mở Đợt Tuyển Sinh Mới</span>
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((b) => {
          const percent = Math.min(100, Math.round((b.registeredCount / (b.targetQuota || 1)) * 100));
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-pink-50 text-fuchsia-700">
                    {b.code}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      b.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700'
                        : b.status === 'reviewing'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {b.status === 'open'
                      ? 'Đang nhận hồ sơ'
                      : b.status === 'reviewing'
                      ? 'Đang chấm xét tuyển'
                      : 'Đã đóng đợt'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                  {b.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{b.courseName}</p>

                {/* Progress */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Tiến độ hồ sơ
                    </span>
                    <span className="font-bold text-gray-900">
                      {b.registeredCount} / {b.targetQuota} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 90 ? 'bg-amber-500' : 'bg-fuchsia-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" /> Ngày bắt đầu:
                    </span>
                    <span className="font-medium text-gray-700">{formatDate(b.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" /> Hạn chót nộp hồ sơ:
                    </span>
                    <span className="font-semibold text-red-600">{formatDate(b.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                <span className="text-[11px] text-gray-400">Vòng xét: {b.round}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(b)}
                    className="p-1.5 text-fuchsia-600 hover:bg-pink-50 rounded-lg transition cursor-pointer"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBatch ? 'Chỉnh Sửa Đợt Tuyển Sinh' : 'Mở Đợt Tuyển Sinh Mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mã đợt *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="DOT-2026-01"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tên đợt tuyển sinh *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Xét tuyển Sớm - Học bạ THPT Đợt 1"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Chỉ tiêu dự kiến</label>
              <input
                type="number"
                value={formData.targetQuota}
                onChange={(e) => setFormData({ ...formData, targetQuota: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Trạng thái đợt</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="open">Đang mở nhận hồ sơ</option>
                <option value="reviewing">Đang chấm xét tuyển</option>
                <option value="closed">Đã kết thúc</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Hạn chót nhận hồ sơ</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              />
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
              className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              {editingBatch ? 'Cập nhật' : 'Tạo Đợt Mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClassesList;
