const express = require("express");

const {
    getAllMajors,
    getMajorById,
    createMajor,
    updateMajor,
    deleteMajor
} = require("../controllers/major.controller");

const {
    protect,
    adminOnly
} = require("../middleware/auth.middleware");


const router = express.Router();


// ========================================
// USER + ADMIN
// ========================================

router.get(
    "/",
    getAllMajors
);


router.get(
    "/:id",
    getMajorById
);


// ========================================
// CHỈ ADMIN
// ========================================

router.post(
    "/",
    protect,
    adminOnly,
    createMajor
);


router.put(
    "/:id",
    protect,
    adminOnly,
    updateMajor
);


router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteMajor
);


module.exports = router;