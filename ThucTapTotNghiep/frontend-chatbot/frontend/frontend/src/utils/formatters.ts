// Helper formatting utilities for Vietnamese Admission Portal

export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatAdmissionMethod(method: string): string {
  switch (method) {
    case 'hoc_ba':
      return 'Xét học bạ THPT';
    case 'thpt':
      return 'Điểm thi THPT';
    case 'dgnl':
      return 'Đánh giá năng lực';
    case 'tuyen_thang':
      return 'Tuyển thẳng & Ưu tiên';
    default:
      return method;
  }
}

export function formatLeadStatus(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'new':
      return { label: 'Mới đăng ký', bg: 'bg-blue-50', text: 'text-blue-700' };
    case 'contacted':
      return { label: 'Đã liên hệ', bg: 'bg-amber-50', text: 'text-amber-700' };
    case 'counseled':
      return { label: 'Đã tư vấn', bg: 'bg-purple-50', text: 'text-purple-700' };
    case 'registered':
      return { label: 'Đã nộp hồ sơ', bg: 'bg-emerald-50', text: 'text-emerald-700' };
    case 'cancelled':
      return { label: 'Đã hủy / Từ chối', bg: 'bg-gray-100', text: 'text-gray-600' };
    default:
      return { label: status, bg: 'bg-gray-50', text: 'text-gray-700' };
  }
}

export function formatApplicationStatus(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'submitted':
      return { label: 'Đã tiếp nhận', bg: 'bg-sky-50', text: 'text-sky-700' };
    case 'validating':
      return { label: 'Đang thẩm định', bg: 'bg-amber-50', text: 'text-amber-700' };
    case 'accepted':
      return { label: 'Đã trúng tuyển', bg: 'bg-emerald-50', text: 'text-emerald-700' };
    case 'enrolled':
      return { label: 'Đã nhập học', bg: 'bg-indigo-50', text: 'text-indigo-700' };
    case 'rejected':
      return { label: 'Không trúng tuyển', bg: 'bg-red-50', text: 'text-red-700' };
    default:
      return { label: status, bg: 'bg-gray-50', text: 'text-gray-700' };
  }
}
