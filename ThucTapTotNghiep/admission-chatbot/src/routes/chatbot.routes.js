const express = require("express");

// Import Controller Chatbot
const chatbotController = require("../controllers/chatbot.controller");

const router = express.Router();

// POST /api/chatbot
// Công dụng: gửi câu hỏi cho Chatbot
router.post("/", chatbotController.chat);

module.exports = router;