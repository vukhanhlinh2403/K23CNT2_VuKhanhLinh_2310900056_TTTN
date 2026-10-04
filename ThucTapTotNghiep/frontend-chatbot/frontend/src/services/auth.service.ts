import type { User, UserRole } from "../types";
import api from "./api";

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

export interface LoginUser extends User {
  isVerified: boolean;
}

export interface LoginResponse {
  token: string;
  user: LoginUser;
}

export const authService = {
  // =====================================================
  // LOGIN
  // =====================================================

  async login(
    data: LoginRequest
  ): Promise<LoginResponse> {
    const response = await api.post(
      "/api/auth/signin",
      {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }
    );

    const responseData = response.data;

    console.log(
      "AUTH LOGIN RESPONSE:",
      responseData
    );

    // ===================================================
    // LẤY DATA TỪ BACKEND
    // ===================================================

    const backendData =
      responseData?.data || responseData;

    // Backend có thể trả user ở:
    // data.user
    // hoặc response.data.user
    const backendUser =
      backendData?.user ||
      responseData?.user;

    if (!backendUser) {
      console.error(
        "Không tìm thấy thông tin user:",
        responseData
      );

      throw new Error(
        "Backend không trả về thông tin người dùng."
      );
    }

    // ===================================================
    // LẤY TOKEN
    // ===================================================

    const token =
      backendData?.accessToken ||
      backendData?.token ||
      responseData?.accessToken ||
      responseData?.token;

    if (!token) {
      console.error(
        "Không tìm thấy access token:",
        responseData
      );

      throw new Error(
        "Backend không trả về access token."
      );
    }

    // ===================================================
    // CHUẨN HÓA USER
    // ===================================================

    const user: LoginUser = {
      ...backendUser,

      // MongoDB thường trả _id
      id:
        backendUser.id ||
        backendUser._id,

      // Backend có thể dùng name hoặc fullName
      fullName:
        backendUser.fullName ||
        backendUser.name ||
        "Thí sinh",

      email:
        backendUser.email,

      // Chuẩn hóa role
      role:
        backendUser.role ||
        "user",

      // Backend có thể dùng isEmailVerified
      isVerified:
        backendUser.isEmailVerified === true ||
        backendUser.isVerified === true,
    };

    console.log(
      "LOGIN USER:",
      user
    );

    console.log(
      "LOGIN TOKEN:",
      token
    );

    // ===================================================
    // LƯU TOKEN + USER
    // ===================================================

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "userEmail",
      user.email
    );

    localStorage.setItem(
      "userRole",
      user.role
    );

    // ===================================================
    // ĐÁNH DẤU ĐÃ ĐĂNG NHẬP
    // ===================================================
    //
    // Có token = đăng nhập thành công.
    // Không dùng isVerified để quyết định
    // isAuthenticated.
    //

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    console.log(
      "LOGIN SUCCESS - TOKEN SAVED"
    );

    // ===================================================
    // RETURN
    // ===================================================

    return {
      token,
      user,
    };
  },

  // =====================================================
  // REGISTER
  // =====================================================

  async register(
    data: RegisterRequest
  ) {
    const response =
      await api.post(
        "/api/auth/signup",
        {
          name: data.fullName,
          email: data.email
            .trim()
            .toLowerCase(),
          password: data.password,
        }
      );

    console.log(
      "REGISTER RESPONSE:",
      response.data
    );

    return response.data;
  },

  // =====================================================
  // VERIFY EMAIL
  // =====================================================

  async verifyEmail(
    token: string
  ) {
    const response =
      await api.post(
        "/api/auth/verify-email",
        {
          token,
        }
      );

    return response.data;
  },

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  async forgotPassword(
    email: string
  ) {
    const response =
      await api.post(
        "/api/auth/forgot-password",
        {
          email: email
            .trim()
            .toLowerCase(),
        }
      );

    return response.data;
  },

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  async resetPassword(
    token: string,
    newPassword: string
  ) {
    const response =
      await api.post(
        "/api/auth/reset-password",
        {
          token,
          newPassword,
        }
      );

    return response.data;
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  },

  // =====================================================
  // GET TOKEN
  // =====================================================

  getToken() {
    return (
      localStorage.getItem("token") ||
      null
    );
  },

  // =====================================================
  // GET USER
  // =====================================================

  getUser(): LoginUser | null {
    const userStr =
      localStorage.getItem("user");

    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error(
        "Không thể đọc user từ localStorage:",
        error
      );

      return null;
    }
  },

  // =====================================================
  // IS AUTHENTICATED
  // =====================================================

  isAuthenticated(): boolean {
    const token =
      localStorage.getItem("token");

    // Chỉ cần có token là đã đăng nhập.
    // Không phụ thuộc isVerified.
    return !!token;
  },
};