const express = require("express");

const admissionController =
    require("../controllers/admission.controller");

const router = express.Router();

// GET: lấy danh sách
router.get("/", admissionController.getAdmissions);

// GET: lấy một bản ghi
router.get("/:id", admissionController.getAdmissionById);

// POST: thêm dữ liệu
router.post("/", admissionController.createAdmission);

// PUT /api/admissions/:id
// Công dụng: sửa thông tin tuyển sinh
router.put("/:id", admissionController.updateAdmission);

// DELETE: xóa dữ liệu
router.delete("/:id", admissionController.deleteAdmission);

module.exports = router;