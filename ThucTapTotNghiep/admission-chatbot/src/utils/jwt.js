const jwt = require("jsonwebtoken");

// Tạo Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            type: "access"
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
        }
    );
};

// Tạo Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            type: "refresh"
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
        }
    );
};

// Kiểm tra Access Token
const verifyAccessToken = (token) => {
    const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );

    if (decoded.type !== "access") {
        throw new Error("Invalid access token");
    }

    return decoded;
};

// Kiểm tra Refresh Token
const verifyRefreshToken = (token) => {
    const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );

    if (decoded.type !== "refresh") {
        throw new Error("Invalid refresh token");
    }

    return decoded;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};