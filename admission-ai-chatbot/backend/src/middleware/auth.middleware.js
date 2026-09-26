const jwt = require("jsonwebtoken");


// =====================================================
// KIỂM TRA USER ĐÃ ĐĂNG NHẬP CHƯA
// =====================================================

const protect = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // ---------------------------------------------
        // Không có Authorization
        // ---------------------------------------------

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Bạn chưa đăng nhập"

            });

        }


        // ---------------------------------------------
        // Kiểm tra Bearer
        // ---------------------------------------------

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Token không đúng định dạng"

            });

        }


        // ---------------------------------------------
        // Lấy Access Token
        // ---------------------------------------------

        const token =
            authHeader.split(" ")[1];


        // ---------------------------------------------
        // Verify Access Token
        // ---------------------------------------------

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_ACCESS_SECRET

            );


        // ---------------------------------------------
        // Lưu thông tin user
        // ---------------------------------------------

        req.user = decoded;


        next();


    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Access Token không hợp lệ hoặc đã hết hạn"

        });

    }

};


// =====================================================
// CHỈ ADMIN MỚI ĐƯỢC ĐI TIẾP
// =====================================================

const adminOnly = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message: "Bạn chưa đăng nhập"

        });

    }


    if (req.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Bạn không có quyền Admin"

        });

    }


    next();

};


module.exports = {

    protect,

    adminOnly

};