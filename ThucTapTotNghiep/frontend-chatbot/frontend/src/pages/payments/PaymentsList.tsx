import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CreditCard,
  Filter
} from 'lucide-react';
import { admissionService } from '../../services/adminssion.service';
import { Modal } from '../../components/common/Modal';
import { formatCurrencyVND, formatDate } from '../../utils/formatters';
import type { Payment } from '../../types';

function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Payment>({
    id: '',
    studentId: '',
    studentName: '',
    candidateName: '',
    candidateCode: '',
    amount: 300000,
    purpose: 'fee',
    paymentMethod: 'vnpay',
    status: 'completed',
    transactionCode: `VN${Math.floor(10000000 + Math.random() * 90000000)}`,
    paymentType: 'le_phi_xet_tuyen',
    paidAt: new Date().toISOString(),
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const loadData = () => {
    setPayments(admissionService.getPayments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      id: `pay-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      studentName: '',
      candidateName: '',
      candidateCode: `TS2026-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: 300000,
      purpose: 'fee',
      paymentMethod: 'vnpay',
      status: 'completed',
      transactionCode: `VN${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentType: 'le_phi_xet_tuyen',
      paidAt: new Date().toISOString(),
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (p: Payment) => {
    const nextStatus = p.status === 'completed' ? 'pending' : 'completed';
    admissionService.savePayment({
      ...p,
      status: nextStatus,
    });
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.amount) {
      alert('Vui lòng nhập tên thí sinh và số tiền');
      return;
    }

    admissionService.savePayment({
      ...formData,
      id: formData.id || `pay-${Date.now()}`,
      candidateName: formData.studentName,
      paidAt: new Date().toISOString(),
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
    loadData();
  };

  const filteredPayments = payments.filter((p) => {
    const studentNameStr = p.studentName || p.candidateName || '';
    const matchQuery =
      studentNameStr.toLowerCase().includes(search.toLowerCase()) ||
      p.candidateCode.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản Lý Lệ Phí & Giao Dịch (Payments)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi dòng tiền lệ phí xét tuyển và học phí tạm thu từ cổng trực tuyến
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhận Thu Tiền Mặt</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-r from-fuchsia-700 to-violet-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-pink-200 uppercase tracking-wider font-semibold">
            Tổng Lệ Phí & Học Phí Đã Thu
          </span>
          <h2 className="text-3xl font-black mt-1">{formatCurrencyVND(totalCollected)}</h2>
          <p className="text-xs text-pink-100 mt-1">
            Bao gồm lệ phí xét học bạ, đánh giá năng lực và học phí học kỳ 1
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-pink-200">Giao dịch thành công</span>
            <p className="text-base font-bold">
              {payments.filter((p) => p.status === 'completed').length} / {payments.length}
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-pink-200">Kênh thanh toán</span>
            <p className="text-base font-bold">VNPay / MoMo / CK</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên thí sinh, mã TS, mã giao dịch..."
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
            <option value="all">Tất cả giao dịch ({payments.length})</option>
            <option value="completed">Đã thanh toán (completed)</option>
            <option value="pending">Chờ xử lý (pending)</option>
            <option value="failed">Thất bại (failed)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Mã GD</th>
                <th className="px-6 py-3.5">Thí sinh</th>
                <th className="px-6 py-3.5">Mục đích</th>
                <th className="px-6 py-3.5">Số tiền</th>
                <th className="px-6 py-3.5">Phương thức</th>
                <th className="px-6 py-3.5">Ngày nộp</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-700">
                      {p.transactionCode}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <p className="leading-tight">{p.studentName || p.candidateName}</p>
                      <span className="text-[11px] font-mono text-gray-400 font-normal">
                        {p.candidateCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {p.purpose === 'fee' ? 'Lệ phí xét tuyển hồ sơ' : 'Học phí tạm thu kỳ 1'}
                    </td>
                    <td className="px-6 py-4 font-bold text-fuchsia-600">
                      {formatCurrencyVND(p.amount)}
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px]">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(p.paymentDate || p.paidAt || '')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {p.status === 'completed'
                          ? 'Thành công'
                          : p.status === 'pending'
                          ? 'Đang chờ'
                          : 'Thất bại'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p)}
                        className="text-xs font-medium text-fuchsia-600 hover:text-fuchsia-800 transition cursor-pointer"
                      >
                        {p.status === 'completed' ? 'Đổi sang Chờ' : 'Duyệt thành công'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ghi Nhận Nộp Tiền / Lệ Phí Trực Tiếp"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Họ tên thí sinh *</label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mã thí sinh</label>
              <input
                type="text"
                value={formData.candidateCode}
                onChange={(e) => setFormData({ ...formData, candidateCode: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Số tiền (VNĐ) *</label>
              <input
                type="number"
                step="50000"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mục đích thu</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="fee">Lệ phí xét tuyển hồ sơ</option>
                <option value="tuition">Học phí kỳ 1</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Hình thức thanh toán</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="cash">Tiền mặt tại trường</option>
                <option value="transfer">Chuyển khoản ngân hàng</option>
                <option value="vnpay">Cổng VNPay</option>
                <option value="momo">Ví MoMo</option>
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
              className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold shadow-xs transition cursor-pointer"
            >
              Lưu Giao Dịch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentsList;
