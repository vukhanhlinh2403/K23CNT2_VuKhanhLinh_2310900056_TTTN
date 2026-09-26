const ChatHistory = require("../models/ChatHistory");
const {
    generateResponse
} = require("../services/ai.service");

/**
 * POST /api/chat
 *
 * Chatbot tuyển sinh:
 * - Không sử dụng AI API
 * - Nhận diện intent bằng rule/keyword
 * - Lấy dữ liệu trực tiếp từ MongoDB
 * - Lưu lịch sử hội thoại
 */
const chat = async (req, res) => {
    try {
        const {
            sessionId,
            message
        } = req.body;

        // ==============================
        // Kiểm tra dữ liệu đầu vào
        // ==============================

        if (!sessionId || !sessionId.trim()) {
            return res.status(400).json({
                success: false,
                message: "sessionId là bắt buộc"
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "message là bắt buộc"
            });
        }

        // ==============================
        // Tạo câu trả lời
        // ==============================

        const result = await generateResponse(
            message.trim()
        );

        // ==============================
        // Xác định user
        // ==============================

        const userId = req.user
            ? req.user.userId
            : null;

        // ==============================
        // Tìm lịch sử chat
        // ==============================

        let chatHistory = await ChatHistory.findOne({
            sessionId,
            userId
        });

        // ==============================
        // Nếu chưa có session
        // ==============================

        if (!chatHistory) {
            chatHistory = new ChatHistory({
                userId,
                sessionId,
                messages: []
            });
        }

        // ==============================
        // Lưu câu hỏi user
        // ==============================

        chatHistory.messages.push({
            role: "user",
            content: message.trim()
        });

        // ==============================
        // Lưu câu trả lời chatbot
        // ==============================

        chatHistory.messages.push({
            role: "assistant",
            content: result.answer
        });

        await chatHistory.save();

        // ==============================
        // Response
        // ==============================

        return res.status(200).json({
            success: true,
            data: {
                sessionId,
                question: message.trim(),
                answer: result.answer,
                intent: result.intent,
                source: result.source
            }
        });

    } catch (error) {
        console.error("Chat error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xử lý câu hỏi",
            error: error.message
        });
    }
};

module.exports = {
    chat
};