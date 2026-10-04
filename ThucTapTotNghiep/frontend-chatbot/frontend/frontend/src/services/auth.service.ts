import type { User, UserRole } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const emailLower = data.email.trim().toLowerCase();

    // Determine role based on email or registered users list
    let role: UserRole = "user";
    let fullName = "Thí sinh";

    if (emailLower.includes("admin") || emailLower === "admin@admission.edu.vn") {
      role = "admin";
      fullName = "Quản Trị Viên Tuyển Sinh";
    } else if (emailLower.includes("manager") || emailLower.includes("truongphong")) {
      role = "manager";
      fullName = "Trưởng Ban Tuyển Sinh";
    } else {
      // Check if registered locally
      const storedUsersStr = localStorage.getItem("registered_accounts");
      const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      const found = storedUsers.find((u: any) => u.email.toLowerCase() === emailLower);

      if (found) {
        role = found.role || "user";
        fullName = found.fullName || found.name || "Thí sinh";
      } else {
        role = "user";
        fullName = data.email.split("@")[0] || "Thí sinh";
      }
    }

    const user: User = {
      id: Date.now().toString(),
      fullName,
      email: data.email,
      role,
      candidateCode: role === "user" ? "TS2026-88991" : undefined,
      appliedMajor: role === "user" ? "Công nghệ Thông tin" : undefined,
    };

    const token = "jwt-token-" + Date.now();

    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      token,
      user,
    };
  },

  async register(data: RegisterRequest) {
    const emailLower = data.email.trim().toLowerCase();
    const role: UserRole = data.role || (emailLower.includes("admin") ? "admin" : "user");

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      role,
      candidateCode: `TS2026-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };

    const storedUsersStr = localStorage.getItem("registered_accounts");
    const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    storedUsers.push(newUser);
    localStorage.setItem("registered_accounts", JSON.stringify(storedUsers));

    return {
      success: true,
      message: "Đăng ký tài khoản thành công!",
      user: newUser,
    };
  },

  async forgotPassword(email: string) {
    return {
      success: true,
      message: `Hướng dẫn đặt lại mật khẩu đã được gửi đến ${email}.`,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    return {
      success: true,
      message: "Đặt lại mật khẩu thành công!",
    };
  },

  async verifyEmail(token: string) {
    return {
      success: true,
      message: "Tài khoản đã được xác thực thành công!",
    };
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  },

  getToken() {
    return localStorage.getItem("token") || (localStorage.getItem("isLoggedIn") === "true" ? "dummy-token" : null);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        // continue
      }
    }

    const email = localStorage.getItem("userEmail");
    const role = (localStorage.getItem("userRole") as UserRole) || "admin";
    if (email) {
      return {
        id: "1",
        fullName: role === "admin" ? "Quản trị viên Tuyển sinh" : "Thí sinh",
        email,
        role,
      };
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token") || localStorage.getItem("isLoggedIn") === "true";
  },
};
