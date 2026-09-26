const express = require("express");

const {
    register,
    login,
    refreshToken
} = require("../controllers/auth.controller");

const router = express.Router();


// =====================================================
// ĐĂNG KÝ
// POST /api/auth/register
// =====================================================

router.post(
    "/register",
    register
);


// =====================================================
// ĐĂNG NHẬP
// POST /api/auth/login
// =====================================================

router.post(
    "/login",
    login
);


// =====================================================
// LẤY ACCESS TOKEN MỚI
// POST /api/auth/refresh
// =====================================================

router.post(
    "/refresh",
    refreshToken
);


module.exports = router;