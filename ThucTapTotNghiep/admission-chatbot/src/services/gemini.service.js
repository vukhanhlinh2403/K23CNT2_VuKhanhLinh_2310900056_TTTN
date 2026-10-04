const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const askGemini = async (question, context = "") => {
    try {
        const response = await client.models.generateContent({
            model: "gemini-3.5-flash-lite",

            contents: `
Bạn là trợ lý AI tuyển sinh của trường.

Quy tắc trả lời:
- Trả lời bằng tiếng Việt.
- Trả lời tự nhiên, dễ hiểu.
- Ưu tiên sử dụng dữ liệu được cung cấp từ hệ thống.
- Không tự bịa điểm chuẩn, học phí, chỉ tiêu,
  phương thức xét tuyển hoặc quy định chính thức của trường.
- Nếu dữ liệu được cung cấp không có thông tin cần thiết,
  hãy nói rõ rằng hệ thống chưa có thông tin chính thức.
- Không khẳng định những thông tin chưa được xác nhận.

Dữ liệu từ hệ thống:
${context || "Chưa có dữ liệu cụ thể."}

Câu hỏi của người dùng:
${question}
`
        });

        return response.text;

    } catch (error) {
        console.error("GEMINI API ERROR:", error);

        throw new Error("Không thể kết nối đến Gemini AI.");
    }
};

module.exports = {
    askGemini
};