const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// =====================================================
// TẠO ACCESS TOKEN
// =====================================================

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};


// =====================================================
// TẠO REFRESH TOKEN
// =====================================================

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

const register = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // Kiểm tra dữ liệu
        // ---------------------------------------------

        if (!fullName || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu"
            });

        }


        // ---------------------------------------------
        // Kiểm tra password
        // ---------------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            });

        }


        // ---------------------------------------------
        // Kiểm tra email đã tồn tại
        // ---------------------------------------------

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email đã được đăng ký"
            });

        }


        // ---------------------------------------------
        // Mã hóa password
        // ---------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ---------------------------------------------
        // Tạo user
        // ---------------------------------------------

        const user = await User.create({

            fullName,

            email: email.toLowerCase(),

            password: hashedPassword,

            role: "user"

        });


        // ---------------------------------------------
        // Tạo Access + Refresh Token
        // ---------------------------------------------

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        res.status(201).json({

            success: true,

            message: "Đăng ký tài khoản thành công",

            data: {

                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                },

                accessToken,

                refreshToken

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Lỗi server",

            error: error.message

        });

    }

};


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // Kiểm tra dữ liệu
        // ---------------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Vui lòng nhập email và mật khẩu"

            });

        }


        // ---------------------------------------------
        // Tìm user
        // ---------------------------------------------

        const user = await User.findOne({

            email: email.toLowerCase()

        });


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Email hoặc mật khẩu không đúng"

            });

        }


        // ---------------------------------------------
        // Kiểm tra password
        // ---------------------------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message: "Email hoặc mật khẩu không đúng"

            });

        }


        // ---------------------------------------------
        // Tạo Access + Refresh Token
        // ---------------------------------------------

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        res.json({

            success: true,

            message: "Đăng nhập thành công",

            data: {

                user: {

                    id: user._id,

                    fullName: user.fullName,

                    email: user.email,

                    role: user.role

                },

                accessToken,

                refreshToken

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Lỗi server",

            error: error.message

        });

    }

};


// =====================================================
// REFRESH TOKEN
// POST /api/auth/refresh
// =====================================================

const refreshToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;


        // ---------------------------------------------
        // Kiểm tra refresh token
        // ---------------------------------------------

        if (!refreshToken) {

            return res.status(401).json({

                success: false,

                message: "Refresh token không được cung cấp"

            });

        }


        // ---------------------------------------------
        // Verify refresh token
        // ---------------------------------------------

        const decoded = jwt.verify(

            refreshToken,

            process.env.JWT_REFRESH_SECRET

        );


        // ---------------------------------------------
        // Tìm user
        // ---------------------------------------------

        const user = await User.findById(
            decoded.userId
        );


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Người dùng không tồn tại"

            });

        }


        // ---------------------------------------------
        // Tạo Access Token mới
        // ---------------------------------------------

        const newAccessToken =
            generateAccessToken(user);


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        res.json({

            success: true,

            message: "Tạo Access Token mới thành công",

            data: {

                accessToken: newAccessToken

            }

        });


    } catch (error) {

        console.error(error);

        return res.status(401).json({

            success: false,

            message: "Refresh token không hợp lệ hoặc đã hết hạn"

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    register,

    login,

    refreshToken

};