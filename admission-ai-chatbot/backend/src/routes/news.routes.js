const express = require("express");

const {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
} = require("../controllers/news.controller");

const router = express.Router();


// GET /api/news
router.get("/", getNews);


// GET /api/news/:id
router.get("/:id", getNewsById);


// POST /api/news
router.post("/", createNews);


// PUT /api/news/:id
router.put("/:id", updateNews);


// DELETE /api/news/:id
router.delete("/:id", deleteNews);


module.exports = router;