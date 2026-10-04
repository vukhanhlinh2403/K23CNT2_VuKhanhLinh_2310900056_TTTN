const crypto = require("crypto");

// Tạo Random Token
const generateRandomToken = (length = 32) => {
    return crypto.randomBytes(length).toString("hex");
};

// Tạo OTP 6 số
const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// Hash Token
const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateRandomToken,
    generateOTP,
    hashToken
};