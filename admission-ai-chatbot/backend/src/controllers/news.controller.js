const News = require("../models/News");

// ========================================
// CREATE NEWS
// POST /api/news
// ========================================
const createNews = async (req, res, next) => {
  try {
    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo tin tức thành công",
      data: news
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET ALL NEWS
// GET /api/news
// ========================================
const getNews = async (req, res, next) => {
  try {
    const news = await News.find()
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET NEWS BY ID
// GET /api/news/:id
// ========================================
const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức"
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// UPDATE NEWS
// PUT /api/news/:id
// ========================================
const updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật tin tức thành công",
      data: news
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE NEWS
// DELETE /api/news/:id
// ========================================
const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(
      req.params.id
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức"
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa tin tức thành công"
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
};