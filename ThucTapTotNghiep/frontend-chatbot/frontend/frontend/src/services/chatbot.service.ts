import type { ChatMessage } from "../types";
import api from "./api";
import { admissionService } from "./adminssion.service";

interface ChatbotApiResponse {
  success: boolean;
  question: string;
  answer: string;
  message?: string;
}

export const chatbotService = {
  async processUserMessage(question: string): Promise<ChatMessage> {
    if (!question.trim()) {
      throw new Error("Vui lòng nhập câu hỏi.");
    }

    const trimmed = question.trim();

    // Kiểm tra số điện thoại
    const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/;
    const phoneMatch = trimmed.match(phoneRegex);

    if (phoneMatch) {
      const phoneNumber = phoneMatch[1];

      try {
        await admissionService.saveLead({
          fullName: "Thí sinh gửi từ Chatbot",
          phone: phoneNumber,
          desiredMajor: "Chưa xác định",
          notes: `Thí sinh gửi SĐT qua đoạn chat: "${trimmed}"`,
          source: "chatbot",
          status: "new",
        });
      } catch (error) {
        console.error("Không thể lưu thông tin thí sinh:", error);
      }

      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        timestamp: new Date().toISOString(),
        text: `Dạ em đã ghi nhận số điện thoại **${phoneNumber}** của bạn. Cán bộ tư vấn sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất nhé!`,
        suggestedQuestions: [
          "Điểm chuẩn ngành Công nghệ thông tin?",
          "Học phí các ngành?",
          "Học bổng năm 2026?",
          "Cách nộp học bạ online?",
        ],
      };
    }

    // Gọi Backend
    try {
      const response = await api.post<ChatbotApiResponse>(
        "/api/chatbot",
        {
          question: trimmed,
        }
      );

      const data = response.data;

      console.log("CHATBOT BACKEND RESPONSE:", data);

      if (!data.success) {
        throw new Error(
          data.message || "Chatbot không thể xử lý câu hỏi."
        );
      }

      // Trả câu trả lời từ Backend về giao diện
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        timestamp: new Date().toISOString(),
        text: data.answer,
      };
    } catch (error) {
      console.error("CHATBOT API ERROR:", error);

      throw new Error(
        "Không thể kết nối đến hệ thống chatbot."
      );
    }
  },
};