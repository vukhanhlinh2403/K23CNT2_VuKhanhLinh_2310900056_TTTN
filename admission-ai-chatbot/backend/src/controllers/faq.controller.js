const FAQ = require("../models/FAQ");

const getAllFAQs = async (req, res, next) => {
  try {
    const items = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const getFAQById = async (req, res, next) => {
  try {
    const item = await FAQ.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy FAQ"
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "question và answer là bắt buộc"
      });
    }

    const item = await FAQ.create({
      question,
      answer,
      category: category || "Chung",
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: "Tạo FAQ thành công",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

const updateFAQ = async (req, res, next) => {
  try {
    const item = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy FAQ"
      });
    }

    res.json({
      success: true,
      message: "Cập nhật FAQ thành công",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

const deleteFAQ = async (req, res, next) => {
  try {
    const item = await FAQ.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy FAQ"
      });
    }

    res.json({
      success: true,
      message: "Xóa FAQ thành công"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
