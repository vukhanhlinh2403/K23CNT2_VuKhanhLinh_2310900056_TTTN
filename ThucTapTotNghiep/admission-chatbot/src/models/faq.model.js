const mongoose = require("mongoose");

// Schema lưu câu hỏi và câu trả lời
const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        answer: {
            type: String,
            required: true
        },

        category: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Tạo Model FAQ
module.exports = mongoose.model("FAQ", faqSchema);