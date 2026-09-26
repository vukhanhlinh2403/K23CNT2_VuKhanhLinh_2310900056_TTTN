const express = require("express");

const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require("../controllers/faq.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllFAQs);
router.get("/:id", getFAQById);

router.post("/", protect, adminOnly, createFAQ);
router.put("/:id", protect, adminOnly, updateFAQ);
router.delete("/:id", protect, adminOnly, deleteFAQ);

module.exports = router;
