const express = require("express");

const {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission
} = require("../controllers/admission.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllAdmissions);
router.get("/:id", getAdmissionById);

router.post("/", protect, adminOnly, createAdmission);
router.put("/:id", protect, adminOnly, updateAdmission);
router.delete("/:id", protect, adminOnly, deleteAdmission);

module.exports = router;
