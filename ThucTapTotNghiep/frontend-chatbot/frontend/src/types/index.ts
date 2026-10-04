// Types definition for University Admission Chatbot & Admin System

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  desiredMajor: string;
  highSchool: string;
  province: string;
  expectedScore: number;
  notes?: string;
  status: 'new' | 'contacted' | 'counseled' | 'registered' | 'cancelled';
  source: 'chatbot' | 'landing_page' | 'hotline' | 'facebook';
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  quota: number;
  tuitionPerTerm: number;
  durationYears: number;
  subjectGroups: string[]; // e.g. ['A00', 'A01', 'D01']
  previousCutoffScore: number;
  description: string;
  careerOpportunities: string[];
}

export interface ClassBatch {
  id: string;
  code: string;
  name: string;
  round: string; // Đợt 1, Đợt 2, v.v.
  courseCode: string;
  courseName: string;
  startDate: string;
  endDate: string;
  targetQuota: number;
  registeredCount: number;
  status: 'open' | 'reviewing' | 'closed';
}

export interface Student {
  id: string;
  candidateCode: string;
  fullName: string;
  cccd: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  highSchool: string;
  majorCode: string;
  majorName: string;
  admissionMethod: 'hoc_ba' | 'thpt' | 'dgnl' | 'tuyen_thang';
  totalScore: number;
  applicationStatus: 'submitted' | 'validating' | 'accepted' | 'enrolled' | 'rejected';
  submissionDate: string;
  paymentStatus: 'unpaid' | 'paid';
}

export interface Teacher {
  id: string;
  staffCode?: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  roleTitle?: string;
  activeConsultations?: number;
  rating?: number;
  avatar?: string;
  title?: string;
  status?: 'active' | 'busy' | 'inactive';
  assignedMajors?: string[];
}

export interface Payment {
  id: string;
  transactionCode: string;
  candidateName?: string;
  studentName?: string;
  candidateCode: string;
  studentId?: string;
  majorName?: string;
  amount: number;
  paymentType?: 'le_phi_xet_tuyen' | 'hoc_phi_tam_thu' | 'le_phi_nhap_hoc' | string;
  purpose?: string;
  paymentMethod: 'vnpay' | 'momo' | 'bank_transfer' | 'cash' | string;
  status: 'completed' | 'pending' | 'failed';
  paidAt?: string;
  paymentDate?: string;
}

export interface SystemUser {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  role: 'admin' | 'counselor' | 'admission_officer' | 'manager' | 'teacher' | 'user' | 'student';
  department?: string;
  status?: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  cards?: {
    title: string;
    description: string;
    details: string[];
    actionLabel?: string;
    actionLink?: string;
  }[];
}

export type UserRole = 'admin' | 'manager' | 'counselor' | 'admission_officer' | 'teacher' | 'user' | 'student';

export interface User {
  id: number | string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  candidateCode?: string;
  appliedMajor?: string;
  createdAt?: string;
  status?: 'active' | 'inactive';
   isVerified: boolean;
}
