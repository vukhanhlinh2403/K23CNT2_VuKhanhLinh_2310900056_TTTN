const FAQ = require("../models/faq.model");

// Lấy danh sách FAQ
const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();

        res.json({
            success: true,
            data: faqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Thêm FAQ
const createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);

        res.status(201).json({
            success: true,
            data: faq
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getFAQs,
    createFAQ
};