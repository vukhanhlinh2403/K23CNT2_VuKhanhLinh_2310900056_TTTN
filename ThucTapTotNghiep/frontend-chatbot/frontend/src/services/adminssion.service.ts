import { INITIAL_COURSES } from '../constants/adminssion';
import type { Lead, Course, ClassBatch, Student, Teacher, Payment, SystemUser } from '../types';

// Mock initial data seeds
const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    fullName: "Nguyễn Hoàng Nam",
    phone: "0912345678",
    email: "hoangnam2008@gmail.com",
    desiredMajor: "Trí tuệ Nhân tạo (AI & Data Science)",
    highSchool: "THPT Chuyên Lê Hồng Phong",
    province: "TP. Hồ Chí Minh",
    expectedScore: 26.5,
    notes: "Thí sinh có chứng chỉ IELTS 7.5, quan tâm học bổng tài năng.",
    status: "new",
    source: "chatbot",
    createdAt: "2026-09-18T14:30:00Z",
  },
  {
    id: "lead-102",
    fullName: "Trịnh Văn Chung",
    phone: "0987654321",
    email: "vanchung.trinh@yahoo.com",
    desiredMajor: "Công nghệ Thông tin",
    highSchool: "THPT Nguyễn Thị Minh Khai",
    province: "TP. Hà Nội",
    expectedScore: 25.0,
    notes: "Hỏi về điều kiện xét học bạ đợt 1 và học phí đóng theo kỳ.",
    status: "counseled",
    source: "chatbot",
    createdAt: "2026-09-17T09:15:00Z",
  },
  {
    id: "lead-103",
    fullName: "Lê Quốc Bảo",
    phone: "0903112233",
    email: "baole.thpt@gmail.com",
    desiredMajor: "Digital Marketing (Marketing Số)",
    highSchool: "THPT Bùi Thị Xuân",
    province: "Bình Dương",
    expectedScore: 24.5,
    notes: "Đã hẹn tư vấn trực tiếp vào thứ 7 tuần này.",
    status: "contacted",
    source: "landing_page",
    createdAt: "2026-09-16T16:45:00Z",
  },
  {
    id: "lead-104",
    fullName: "Phạm Thùy Linh",
    phone: "0934567890",
    email: "thuylinh.pham@outlook.com",
    desiredMajor: "Quản trị Kinh doanh",
    highSchool: "THPT Chuyên Thăng Long",
    province: "Lâm Đồng",
    expectedScore: 25.5,
    notes: "Đã hoàn thành nộp hồ sơ xét học bạ online.",
    status: "registered",
    source: "chatbot",
    createdAt: "2026-09-15T11:20:00Z",
  },
  {
    id: "lead-105",
    fullName: "Võ Minh Khang",
    phone: "0978123987",
    email: "khangvo.dev@gmail.com",
    desiredMajor: "Thiết kế Đồ họa & Truyền thông Đa phương tiện",
    highSchool: "THPT Trưng Vương",
    province: "Đồng Nai",
    expectedScore: 23.0,
    notes: "Quan tâm đến bài thi năng khiếu vẽ và đồ họa số.",
    status: "counseled",
    source: "facebook",
    createdAt: "2026-09-14T08:10:00Z",
  },
];

const INITIAL_CLASSES: ClassBatch[] = [
  {
    id: "cls-01",
    code: "DOT-2026-01",
    name: "Xét tuyển Sớm - Học bạ THPT Đợt 1",
    round: "Đợt 1",
    courseCode: "ALL",
    courseName: "Tất cả các ngành đào tạo",
    startDate: "2026-03-01",
    endDate: "2026-05-30",
    targetQuota: 800,
    registeredCount: 642,
    status: "open",
  },
  {
    id: "cls-02",
    code: "DOT-2026-02",
    name: "Xét tuyển Điểm Đánh giá năng lực ĐHQG",
    round: "Đợt ĐGNL",
    courseCode: "7480201",
    courseName: "Khối ngành Kỹ thuật & Công nghệ",
    startDate: "2026-04-15",
    endDate: "2026-06-15",
    targetQuota: 450,
    registeredCount: 310,
    status: "open",
  },
  {
    id: "cls-03",
    code: "DOT-2026-03",
    name: "Xét tuyển Kết quả Kỳ thi Tốt nghiệp THPT 2026",
    round: "Đợt Chính thức",
    courseCode: "ALL",
    courseName: "Tất cả các ngành đào tạo",
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    targetQuota: 1200,
    registeredCount: 154,
    status: "open",
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-01",
    candidateCode: "TS2026-00412",
    fullName: "Đỗ Gia Huy",
    cccd: "079204011234",
    email: "giahuy.do@gmail.com",
    phone: "0908123456",
    gender: "Nam",
    birthDate: "2008-04-12",
    highSchool: "THPT Chuyên Lê Hồng Phong",
    majorCode: "7480201",
    majorName: "Công nghệ Thông tin",
    admissionMethod: "hoc_ba",
    totalScore: 27.5,
    applicationStatus: "accepted",
    submissionDate: "2026-09-10",
    paymentStatus: "paid",
  },
  {
    id: "std-02",
    candidateCode: "TS2026-00589",
    fullName: "Nguyễn Hà My",
    cccd: "079204022345",
    email: "hamy.nguyen@gmail.com",
    phone: "0918234567",
    gender: "Nữ",
    birthDate: "2008-11-20",
    highSchool: "THPT Gia Định",
    majorCode: "7480107",
    majorName: "Trí tuệ Nhân tạo (AI & Data Science)",
    admissionMethod: "dgnl",
    totalScore: 28.2,
    applicationStatus: "validating",
    submissionDate: "2026-09-12",
    paymentStatus: "paid",
  },
  {
    id: "std-03",
    candidateCode: "TS2026-00601",
    fullName: "Vũ Minh Quân",
    cccd: "079204033456",
    email: "minhquan.vu@gmail.com",
    phone: "0938345678",
    gender: "Nam",
    birthDate: "2008-08-15",
    highSchool: "THPT Nguyễn Thượng Hiền",
    majorCode: "7340101",
    majorName: "Quản trị Kinh doanh",
    admissionMethod: "thpt",
    totalScore: 25.8,
    applicationStatus: "submitted",
    submissionDate: "2026-09-15",
    paymentStatus: "unpaid",
  },
  {
    id: "std-04",
    candidateCode: "TS2026-00714",
    fullName: "Lê Ngọc Diệp",
    cccd: "079204044567",
    email: "ngocdiep.le@gmail.com",
    phone: "0948456789",
    gender: "Nữ",
    birthDate: "2008-01-25",
    highSchool: "THPT Trần Đại Nghĩa",
    majorCode: "7340115",
    majorName: "Digital Marketing (Marketing Số)",
    admissionMethod: "hoc_ba",
    totalScore: 26.2,
    applicationStatus: "enrolled",
    submissionDate: "2026-09-05",
    paymentStatus: "paid",
  },
  {
    id: "std-user-default",
    candidateCode: "TS2026-88991",
    fullName: "Nguyễn Thí Sinh",
    cccd: "079208009988",
    email: "user@admission.edu.vn",
    phone: "0988776655",
    gender: "Nam",
    birthDate: "2008-07-20",
    highSchool: "THPT Chu Văn An",
    majorCode: "7480201",
    majorName: "Công nghệ Thông tin",
    admissionMethod: "hoc_ba",
    totalScore: 26.8,
    applicationStatus: "accepted",
    submissionDate: "2026-09-16",
    paymentStatus: "paid",
  }
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "tc-01",
    staffCode: "GV-TS01",
    fullName: "PGS.TS. Trần Đình Hoàng",
    email: "hoang.td@admission.edu.vn",
    phone: "0903889901",
    department: "Khoa Công nghệ Thông tin",
    roleTitle: "Trưởng ban Tư vấn Khối Công nghệ & AI",
    activeConsultations: 124,
    rating: 4.9,
  },
  {
    id: "tc-02",
    staffCode: "GV-TS02",
    fullName: "ThS. Nguyễn Thị Bích Ngọc",
    email: "ngoc.ntb@admission.edu.vn",
    phone: "0903889902",
    department: "Khoa Kinh tế & Quản trị",
    roleTitle: "Chuyên viên Tư vấn Tuyển sinh Cao cấp",
    activeConsultations: 98,
    rating: 4.8,
  },
  {
    id: "tc-03",
    staffCode: "GV-TS03",
    fullName: "TS. Lê Quang Vũ",
    email: "vu.lq@admission.edu.vn",
    phone: "0903889903",
    department: "Phòng Quản lý Đào tạo",
    roleTitle: "Cán bộ Thẩm định Hồ sơ & Học bổng",
    activeConsultations: 85,
    rating: 4.9,
  },
  {
    id: "tc-04",
    staffCode: "GV-TS04",
    fullName: "ThS. Hoàng Phương Anh",
    email: "anh.hp@admission.edu.vn",
    phone: "0903889904",
    department: "Khoa Ngoại ngữ",
    roleTitle: "Tư vấn viên Chương trình Liên kết Quốc tế",
    activeConsultations: 76,
    rating: 4.7,
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay-01",
    transactionCode: "VN-PAY-883921",
    candidateName: "Đỗ Gia Huy",
    candidateCode: "TS2026-00412",
    majorName: "Công nghệ Thông tin",
    amount: 1500000,
    paymentType: "le_phi_nhap_hoc",
    paymentMethod: "vnpay",
    status: "completed",
    paidAt: "2026-09-18T10:20:00Z",
  },
  {
    id: "pay-02",
    transactionCode: "MB-2026-99120",
    candidateName: "Nguyễn Hà My",
    candidateCode: "TS2026-00589",
    majorName: "Trí tuệ Nhân tạo (AI & Data Science)",
    amount: 500000,
    paymentType: "le_phi_xet_tuyen",
    paymentMethod: "bank_transfer",
    status: "completed",
    paidAt: "2026-09-17T15:45:00Z",
  },
  {
    id: "pay-03",
    transactionCode: "MOMO-339182",
    candidateName: "Lê Ngọc Diệp",
    candidateCode: "TS2026-00714",
    majorName: "Digital Marketing (Marketing Số)",
    amount: 17500000,
    paymentType: "hoc_phi_tam_thu",
    paymentMethod: "momo",
    status: "completed",
    paidAt: "2026-09-16T14:10:00Z",
  },
  {
    id: "pay-04",
    transactionCode: "MB-2026-99231",
    candidateName: "Vũ Minh Quân",
    candidateCode: "TS2026-00601",
    majorName: "Quản trị Kinh doanh",
    amount: 500000,
    paymentType: "le_phi_xet_tuyen",
    paymentMethod: "bank_transfer",
    status: "pending",
    paidAt: "2026-09-18T16:00:00Z",
  },
  {
    id: "pay-user-01",
    transactionCode: "VN-PAY-998811",
    candidateName: "Nguyễn Thí Sinh",
    candidateCode: "TS2026-88991",
    majorName: "Công nghệ Thông tin",
    amount: 500000,
    paymentType: "le_phi_xet_tuyen",
    paymentMethod: "vnpay",
    status: "completed",
    paidAt: "2026-09-16T09:30:00Z",
  }
];

const INITIAL_USERS: SystemUser[] = [
  {
    id: "usr-01",
    fullName: "Quản trị viên Hệ thống (Admin)",
    email: "admin@admission.edu.vn",
    role: "admin",
    department: "Trung tâm Công nghệ Thông tin",
    status: "active",
    lastLogin: "2026-09-19T06:40:00Z",
    createdAt: "2026-01-01",
  },
  {
    id: "usr-02",
    fullName: "Nguyễn Thanh Sơn (Trưởng phòng Tuyển sinh)",
    email: "son.nt@admission.edu.vn",
    role: "manager",
    department: "Phòng Tuyển sinh & Truyền thông",
    status: "active",
    lastLogin: "2026-09-18T17:15:00Z",
    createdAt: "2026-01-15",
  },
  {
    id: "usr-03",
    fullName: "Trần Mai Phương (Cán bộ tư vấn)",
    email: "phuong.tm@admission.edu.vn",
    role: "counselor",
    department: "Tổ Tư vấn Chatbot & Hotline",
    status: "active",
    lastLogin: "2026-09-19T05:30:00Z",
    createdAt: "2026-02-10",
  },
  {
    id: "usr-04",
    fullName: "Lê Văn Đạt (Thẩm định hồ sơ)",
    email: "dat.lv@admission.edu.vn",
    role: "admission_officer",
    department: "Hội đồng Tuyển sinh 2026",
    status: "active",
    lastLogin: "2026-09-17T11:00:00Z",
    createdAt: "2026-02-20",
  },
  {
    id: "usr-05",
    fullName: "Nguyễn Thí Sinh (Tài khoản Người Dùng)",
    email: "user@admission.edu.vn",
    role: "user",
    department: "Thí sinh đăng ký xét tuyển",
    status: "active",
    lastLogin: "2026-09-20T10:00:00Z",
    createdAt: "2026-03-01",
  },
];

export const admissionService = {
  // Leads
  getLeads(): Lead[] {
    const data = localStorage.getItem("adm_leads");
    if (!data) {
      localStorage.setItem("adm_leads", JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(data);
  },
  saveLead(lead: Partial<Lead>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      id: lead.id || `lead-${Date.now()}`,
      fullName: lead.fullName || "Thí sinh mới",
      phone: lead.phone || "",
      email: lead.email || "",
      desiredMajor: lead.desiredMajor || "Công nghệ Thông tin",
      highSchool: lead.highSchool || "Chưa cập nhật",
      province: lead.province || "Toàn quốc",
      expectedScore: Number(lead.expectedScore) || 24,
      notes: lead.notes || "",
      status: lead.status || "new",
      source: lead.source || "chatbot",
      createdAt: lead.createdAt || new Date().toISOString(),
    };

    const index = leads.findIndex((l) => l.id === newLead.id);
    if (index >= 0) {
      leads[index] = newLead;
    } else {
      leads.unshift(newLead);
    }
    localStorage.setItem("adm_leads", JSON.stringify(leads));
    return newLead;
  },
  deleteLead(id: string) {
    const leads = this.getLeads().filter((l) => l.id !== id);
    localStorage.setItem("adm_leads", JSON.stringify(leads));
  },

  // Courses
  getCourses(): Course[] {
    const data = localStorage.getItem("adm_courses");
    if (!data) {
      localStorage.setItem("adm_courses", JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(data);
  },
  saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.unshift(course);
    }
    localStorage.setItem("adm_courses", JSON.stringify(courses));
    return course;
  },
  deleteCourse(id: string) {
    const courses = this.getCourses().filter((c) => c.id !== id);
    localStorage.setItem("adm_courses", JSON.stringify(courses));
  },

  // Classes / Admission Batches
  getClasses(): ClassBatch[] {
    const data = localStorage.getItem("adm_classes");
    if (!data) {
      localStorage.setItem("adm_classes", JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    return JSON.parse(data);
  },
  saveClass(batch: ClassBatch): ClassBatch {
    const list = this.getClasses();
    const index = list.findIndex((b) => b.id === batch.id);
    if (index >= 0) {
      list[index] = batch;
    } else {
      list.unshift(batch);
    }
    localStorage.setItem("adm_classes", JSON.stringify(list));
    return batch;
  },
  deleteClass(id: string) {
    const list = this.getClasses().filter((b) => b.id !== id);
    localStorage.setItem("adm_classes", JSON.stringify(list));
  },

  // Students / Candidates
  getStudents(): Student[] {
    const data = localStorage.getItem("adm_students");
    if (!data) {
      localStorage.setItem("adm_students", JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(data);
  },
  getStudentByEmail(email: string): Student | undefined {
    const students = this.getStudents();
    return students.find((s) => s.email.toLowerCase() === email.toLowerCase());
  },
  saveStudent(student: Student): Student {
    const list = this.getStudents();
    const index = list.findIndex((s) => s.id === student.id || s.candidateCode === student.candidateCode);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.unshift(student);
    }
    localStorage.setItem("adm_students", JSON.stringify(list));
    return student;
  },
  deleteStudent(id: string) {
    const list = this.getStudents().filter((s) => s.id !== id);
    localStorage.setItem("adm_students", JSON.stringify(list));
  },

  // Teachers / Counselors
  getTeachers(): Teacher[] {
    const data = localStorage.getItem("adm_teachers");
    if (!data) {
      localStorage.setItem("adm_teachers", JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    return JSON.parse(data);
  },
  saveTeacher(teacher: Teacher): Teacher {
    const list = this.getTeachers();
    const index = list.findIndex((t) => t.id === teacher.id);
    if (index >= 0) {
      list[index] = teacher;
    } else {
      list.unshift(teacher);
    }
    localStorage.setItem("adm_teachers", JSON.stringify(list));
    return teacher;
  },
  deleteTeacher(id: string) {
    const list = this.getTeachers().filter((t) => t.id !== id);
    localStorage.setItem("adm_teachers", JSON.stringify(list));
  },

  // Payments
  getPayments(): Payment[] {
    const data = localStorage.getItem("adm_payments");
    if (!data) {
      localStorage.setItem("adm_payments", JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(data);
  },
  getPaymentsByCandidate(candidateCodeOrName: string): Payment[] {
    const list = this.getPayments();
    return list.filter(
      (p) =>
        p.candidateCode === candidateCodeOrName ||
        (p.candidateName && p.candidateName.toLowerCase().includes(candidateCodeOrName.toLowerCase())) ||
        (p.studentName && p.studentName.toLowerCase().includes(candidateCodeOrName.toLowerCase()))
    );
  },
  savePayment(payment: Payment): Payment {
    const list = this.getPayments();
    const index = list.findIndex((p) => p.id === payment.id);
    if (index >= 0) {
      list[index] = payment;
    } else {
      list.unshift(payment);
    }
    localStorage.setItem("adm_payments", JSON.stringify(list));
    return payment;
  },

  // Users
  getUsers(): SystemUser[] {
    const data = localStorage.getItem("adm_users");
    if (!data) {
      localStorage.setItem("adm_users", JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },
  saveUser(user: SystemUser): SystemUser {
    const list = this.getUsers();
    const index = list.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      list[index] = user;
    } else {
      list.unshift(user);
    }
    localStorage.setItem("adm_users", JSON.stringify(list));
    return user;
  },
  deleteUser(id: string) {
    const list = this.getUsers().filter((u) => u.id !== id);
    localStorage.setItem("adm_users", JSON.stringify(list));
  },
};
