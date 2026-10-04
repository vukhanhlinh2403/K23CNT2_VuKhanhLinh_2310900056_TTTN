import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Download,
  QrCode,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { admissionService } from '../../services/adminssion.service';
import { formatCurrencyVND, formatDateTime } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import type { Payment } from '../../types';

export default function UserPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedFee, setSelectedFee] = useState({
    type: 'le_phi_nhap_hoc',
    title: 'Lệ phí xác nhận nhập học & BHYT ban đầu',
    amount: 1500000,
    method: 'vnpay',
  });

  const loadData = () => {
    const all = admissionService.getPayments();
    const candidateCode = user?.candidateCode || 'TS2026-88991';
    const userPayments = all.filter(
      (p) =>
        p.candidateCode === candidateCode ||
        (p.candidateName && user?.fullName && p.candidateName.toLowerCase().includes(user.fullName.toLowerCase())) ||
        (p.studentName && user?.fullName && p.studentName.toLowerCase().includes(user.fullName.toLowerCase()))
    );
    setPayments(userPayments.length > 0 ? userPayments : [all[0]]);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      transactionCode: `VN-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      candidateName: user?.fullName || 'Nguyễn Thí Sinh',
      candidateCode: user?.candidateCode || 'TS2026-88991',
      majorName: user?.appliedMajor || 'Công nghệ Thông tin',
      amount: selectedFee.amount,
      paymentType: selectedFee.type as any,
      paymentMethod: selectedFee.method as any,
      status: 'completed',
      paidAt: new Date().toISOString(),
    };

    admissionService.savePayment(newPayment);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setIsPayModalOpen(false);
      loadData();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Cổng Thanh Toán Trực Tuyến</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Lệ Phí Xét Tuyển & Biên Lai Điện Tử
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Hỗ trợ thanh toán nhanh chóng, an toàn qua Cổng VNPay, Ví MoMo và Quét mã QR Ngân hàng 24/7
        </p>
      </div>

      {/* Pending Fee Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full">
            Khoản Cần Nộp Để Hoàn Tất Nhập Học
          </span>
          <h2 className="text-xl font-bold mt-2">
            Lệ phí xác nhận nhập học & BHYT ban đầu
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Dành cho thí sinh đã đủ điều kiện trúng tuyển sớm. Khoản tạm thu sẽ được khấu trừ trực tiếp vào biên lai học phí học kỳ 1.
          </p>
          <div className="text-2xl font-extrabold text-amber-300 pt-1">
            {formatCurrencyVND(1500000)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedFee({
              type: 'le_phi_nhap_hoc',
              title: 'Lệ phí xác nhận nhập học & BHYT ban đầu',
              amount: 1500000,
              method: 'vnpay',
            });
            setIsPayModalOpen(true);
          }}
          className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl transition shadow-md self-start md:self-auto cursor-pointer"
        >
          Nộp Trực Tuyến Ngay
        </button>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Lịch Sử Giao Dịch & Biên Lai Của Bạn</h3>
            <p className="text-xs text-gray-500">Mọi khoản nộp đều được cấp biên lai điện tử có giá trị pháp lý</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Mã Giao Dịch</th>
                <th className="px-6 py-3.5">Nội dung khoản nộp</th>
                <th className="px-6 py-3.5">Số tiền</th>
                <th className="px-6 py-3.5">Hình thức</th>
                <th className="px-6 py-3.5">Thời gian</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Biên lai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                    {p.transactionCode}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {p.paymentType === 'le_phi_xet_tuyen'
                      ? 'Lệ phí đăng ký xét tuyển học bạ'
                      : p.paymentType === 'le_phi_nhap_hoc'
                      ? 'Lệ phí xác nhận nhập học & BHYT'
                      : 'Học phí tạm thu'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatCurrencyVND(p.amount)}
                  </td>
                  <td className="px-6 py-4 uppercase font-semibold text-gray-600">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-sm text-[10px]">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDateTime(p.paidAt || new Date().toISOString())}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Đang tải biên lai điện tử mã ${p.transactionCode}...`)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] p-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Thanh Toán Lệ Phí Tuyển Sinh Trực Tuyến"
        maxWidth="md"
      >
        {paySuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Giao Dịch Thành Công!</h3>
            <p className="text-xs text-gray-500">Hệ thống đã ghi nhận biên lai nộp lệ phí của bạn.</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4 text-xs">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-1">
              <span className="text-gray-500 text-[11px]">Khoản thanh toán:</span>
              <p className="font-bold text-gray-900 text-sm">{selectedFee.title}</p>
              <p className="text-lg font-extrabold text-blue-600 pt-1">
                {formatCurrencyVND(selectedFee.amount)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Chọn phương thức thanh toán:</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="border p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="method"
                    checked={selectedFee.method === 'vnpay'}
                    onChange={() => setSelectedFee({ ...selectedFee, method: 'vnpay' })}
                    className="text-blue-600"
                  />
                  <div>
                    <strong className="block text-gray-900 text-xs">Cổng VNPay</strong>
                    <span className="text-[10px] text-gray-400">Thẻ ATM / QR Pay</span>
                  </div>
                </label>

                <label className="border p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="method"
                    checked={selectedFee.method === 'momo'}
                    onChange={() => setSelectedFee({ ...selectedFee, method: 'momo' })}
                    className="text-blue-600"
                  />
                  <div>
                    <strong className="block text-gray-900 text-xs">Ví MoMo</strong>
                    <span className="text-[10px] text-gray-400">Quét mã tiện lợi</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50">
              <QrCode className="w-16 h-16 text-gray-700 mx-auto mb-1" />
              <p className="text-[11px] text-gray-500">Mã QR động tự động sinh sau khi bấm Xác nhận</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 font-medium transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Nhận Thanh Toán</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
