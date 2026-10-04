const express = require("express");

const majorController =
    require("../controllers/major.controller");

const router = express.Router();

// GET: xem danh sách ngành
router.get("/", majorController.getMajors);

// POST: thêm ngành
router.post("/", majorController.createMajor);

module.exports = router;