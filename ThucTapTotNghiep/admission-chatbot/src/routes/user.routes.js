const express = require("express");

// Import Controller
// Công dụng: lấy hàm xử lý User từ Controller
const userController = require("../controllers/user.controller");

// Import User Model
const User = require("../models/user.model");

// Import Auth Middleware
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// GET /api/users
// Công dụng: lấy danh sách User
router.get("/", userController.getUsers);

// GET /api/users/me
// Công dụng: lấy thông tin User đang đăng nhập
router.get(
    "/me",
    authMiddleware,
    async (req, res, next) => {
        try {
            const user = await User.findById(
                req.user.sub
            ).select(
                "-password -refreshTokenHash"
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User không tồn tại"
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;