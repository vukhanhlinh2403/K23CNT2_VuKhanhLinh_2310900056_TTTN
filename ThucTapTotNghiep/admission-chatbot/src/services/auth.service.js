const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require("../utils/jwt");

const {
    generateRandomToken,
    hashToken
} = require("../utils/otp");

const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require("./email.service");

// ====================
// SIGNUP
// ====================

const signup = async ({
    name,
    email,
    password
}) => {
    email = email.toLowerCase().trim();

    // Kiểm tra email đã tồn tại
    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new Error("Email đã được đăng ký");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    // Tạo token xác thực email
    const verifyToken = generateRandomToken(32);

    // Tạo user
    const user = await User.create({
        name,
        email,
        password: passwordHash,

        emailVerifyToken: hashToken(verifyToken),

        emailVerifyExpires: new Date(
            Date.now() +
            Number(
                process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15
            ) * 60 * 1000
        )
    });

    // Gửi email xác thực
    await sendVerificationEmail(
        email,
        name,
        verifyToken
    );

    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
};

// ====================
// VERIFY EMAIL
// ====================

const verifyEmail = async (token) => {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
        emailVerifyToken: tokenHash,

        emailVerifyExpires: {
            $gt: new Date()
        }
    }).select(
        "+emailVerifyToken +emailVerifyExpires"
    );

    if (!user) {
        throw new Error(
            "Token xác thực không hợp lệ hoặc đã hết hạn"
        );
    }

    // Xác thực email
    user.isEmailVerified = true;

    // Xóa token sau khi sử dụng
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    return true;
};

// ====================
// SIGNIN
// ====================

const signin = async ({
    email,
    password
}) => {
    email = email.toLowerCase().trim();

    // Tìm user và lấy password + refreshTokenHash
    const user = await User.findOne({
        email
    }).select(
        "+password +refreshTokenHash"
    );

    if (!user) {
        throw new Error(
            "Email hoặc mật khẩu không đúng"
        );
    }

    // Kiểm tra mật khẩu
    const passwordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatched) {
        throw new Error(
            "Email hoặc mật khẩu không đúng"
        );
    }

    // Kiểm tra email đã xác thực chưa
    if (!user.isEmailVerified) {
        throw new Error(
            "Vui lòng xác thực email trước khi đăng nhập"
        );
    }

    // Tạo Access Token
    const accessToken = generateAccessToken(user);

    // Tạo Refresh Token
    const refreshToken = generateRefreshToken(user);

    // Hash Refresh Token trước khi lưu
    user.refreshTokenHash = await bcrypt.hash(
        refreshToken,
        12
    );

    // Lưu thời gian đăng nhập
    user.lastLoginAt = new Date();

    await user.save();

    return {
        accessToken,
        refreshToken,

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};
// ====================
// REFRESH ACCESS TOKEN
// ====================

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error(
            "Refresh token không tồn tại"
        );
    }

    let payload;

    // Kiểm tra Refresh Token có hợp lệ không
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new Error(
            "Refresh token không hợp lệ hoặc đã hết hạn"
        );
    }

    // Kiểm tra loại token
    if (payload.type !== "refresh") {
        throw new Error("Token không hợp lệ");
    }

    // Tìm user theo ID trong token
    const user = await User.findById(
        payload.sub
    ).select("+refreshTokenHash");

    if (!user || !user.refreshTokenHash) {
        throw new Error(
            "Refresh token không hợp lệ"
        );
    }

    // So sánh Refresh Token gửi lên
    // với hash đang lưu trong database
    const matched = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash
    );

    if (!matched) {
        throw new Error(
            "Refresh token không hợp lệ"
        );
    }

    // Tạo Access Token mới
    const accessToken =
        generateAccessToken(user);

    // Tạo Refresh Token mới
    const newRefreshToken =
        generateRefreshToken(user);

    // Hash Refresh Token mới
    user.refreshTokenHash =
        await bcrypt.hash(
            newRefreshToken,
            12
        );

    // Lưu hash mới vào MongoDB
    await user.save();

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
};
// ====================
// FORGOT PASSWORD
// ====================

const forgotPassword = async (email) => {
    email = email.toLowerCase().trim();

    const user = await User.findOne({
        email
    });

    /*
     * Không báo email có tồn tại hay không
     * để tránh email enumeration.
     */

    if (!user) {
        return true;
    }

    // Tạo token reset password
    const token = generateRandomToken(32);

    // Hash token trước khi lưu
    user.passwordResetTokenHash =
        hashToken(token);

    // Thiết lập thời gian hết hạn
    user.passwordResetExpires = new Date(
        Date.now() +
        Number(
            process.env.RESET_PASSWORD_EXPIRES_MINUTES || 15
        ) * 60 * 1000
    );

    await user.save();

    // Gửi email reset password
    await sendPasswordResetEmail(
        user.email,
        user.name,
        token
    );

    return true;
};
// ====================
// VERIFY FORGOT PASSWORD
// ====================

const verifyForgotPassword = async (token) => {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
        passwordResetTokenHash: tokenHash,

        passwordResetExpires: {
            $gt: new Date()
        }
    }).select(
        "+passwordResetTokenHash +passwordResetExpires"
    );

    if (!user) {
        throw new Error(
            "Token reset password không hợp lệ hoặc đã hết hạn"
        );
    }

    return {
        valid: true
    };
};
// ====================
// RESET PASSWORD
// ====================

const resetPassword = async (
    token,
    newPassword
) => {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
        passwordResetTokenHash: tokenHash,

        passwordResetExpires: {
            $gt: new Date()
        }
    }).select(
        "+passwordResetTokenHash +passwordResetExpires +refreshTokenHash"
    );

    if (!user) {
        throw new Error(
            "Token reset password không hợp lệ hoặc đã hết hạn"
        );
    }

    // Hash mật khẩu mới
    user.password = await bcrypt.hash(
        newPassword,
        12
    );

    // Xóa reset token sau khi sử dụng
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;

    /*
     * Đăng xuất tất cả session
     * sau khi đổi password.
     */
    user.refreshTokenHash = undefined;

    await user.save();

    return true;
};
// Đăng xuất
const signout = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshTokenHash: 1
            }
        }
    );

    return true;
};
// ====================
// EXPORT
// ====================

module.exports = {
    signup,
    verifyEmail,
    signin,
    refreshAccessToken,
    forgotPassword,
    verifyForgotPassword,
    resetPassword,
    signout
};