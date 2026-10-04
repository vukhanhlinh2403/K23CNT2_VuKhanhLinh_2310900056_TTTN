const express = require("express");

const faqController = require("../controllers/faq.controller");

const router = express.Router();

// GET /api/faqs → lấy FAQ
router.get("/", faqController.getFAQs);

// POST /api/faqs → thêm FAQ
router.post("/", faqController.createFAQ);

module.exports = router;