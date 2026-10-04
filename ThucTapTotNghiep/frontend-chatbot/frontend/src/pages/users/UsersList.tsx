import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Shield,
  User as UserIcon,
  Trash2,
  Lock,
  Mail
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import type { UserRole, SystemUser } from '../../types';

function UsersList() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });

  const loadData = () => {
    setUsers(admissionService.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      admissionService.deleteUser(id);
      loadData();
    }
  };

  const handleRoleChange = (u: SystemUser, newRole: UserRole) => {
    admissionService.saveUser({
      ...u,
      role: newRole as any,
    });
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Vui lòng điền đầy đủ tên và email');
      return;
    }

    admissionService.saveUser({
      id: `usr-${Date.now()}`,
      name: formData.name,
      fullName: formData.name,
      email: formData.email,
      role: formData.role as any,
      status: formData.status,
      createdAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    loadData();
  };

  const filtered = users.filter((u) => {
    const displayName = u.name || u.fullName || '';
    return (
      displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Phân Quyền & Quản Lý Tài Khoản (Users & RBAC)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản trị viên (Admin) quản lý toàn bộ hệ thống; Thí sinh (User) chỉ truy cập cổng nộp hồ sơ cá nhân
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Tài Khoản Mới</span>
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-red-950">Quyền Quản Trị Viên (Admin)</h4>
            <p className="text-xs text-red-800/80 mt-0.5 leading-relaxed">
              Truy cập Dashboard, duyệt hồ sơ, chỉ tiêu ngành học, phân công ban tư vấn, quản lý thí sinh và doanh thu lệ phí.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-fuchsia-950">Quyền Thí Sinh / Người Dùng (User)</h4>
            <p className="text-xs text-fuchsia-800/80 mt-0.5 leading-relaxed">
              Tự động điều hướng vào trang <code>/user</code>: Nộp hồ sơ học bạ, tra cứu điểm chuẩn ngành, thanh toán lệ phí trực tuyến và chat với trợ lý AI.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tài khoản theo họ tên, email..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-fuchsia-500 focus:bg-white transition"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
          Tổng cộng: <strong>{filtered.length}</strong> tài khoản
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Người dùng</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Phân quyền (Role)</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5">Ngày tạo</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {(u.name || u.fullName || 'U').charAt(0)}
                      </div>
                      <span>{u.name || u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xl border outline-none cursor-pointer ${
                        u.role === 'admin'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : u.role === 'manager'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-pink-50 text-fuchsia-700 border-pink-200'
                      }`}
                    >
                      <option value="admin">Quản trị viên (admin)</option>
                      <option value="manager">Trưởng ban (manager)</option>
                      <option value="teacher">Tư vấn viên (teacher)</option>
                      <option value="user">Thí sinh / Người dùng (user)</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                      Đang hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Xóa tài khoản"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tạo Tài Khoản Người Dùng Mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Họ và tên *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email tài khoản *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@admission.edu.vn"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Phân quyền (Role) *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500 font-medium"
            >
              <option value="user">Thí sinh / Người dùng (User) - Chỉ vào Cổng Thí Sinh</option>
              <option value="admin">Quản trị viên (Admin) - Toàn quyền Quản Trị Tuyển Sinh</option>
              <option value="manager">Trưởng ban tuyển sinh (Manager)</option>
              <option value="teacher">Cán bộ tư vấn (Teacher)</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Mật khẩu mặc định cho tài khoản mới được tạo là <strong>123456</strong>.</span>
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
              Tạo Tài Khoản
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersList;
