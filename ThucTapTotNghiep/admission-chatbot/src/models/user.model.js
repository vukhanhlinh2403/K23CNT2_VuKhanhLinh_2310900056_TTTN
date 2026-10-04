const mongoose = require("mongoose");

// Schema lưu thông tin người dùng
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        emailVerifyToken: {
            type: String,
            select: false
        },

        emailVerifyExpires: {
            type: Date,
            select: false
        },

        refreshTokenHash: {
            type: String,
            select: false
        },

        passwordResetTokenHash: {
            type: String,
            select: false
        },

        passwordResetExpires: {
            type: Date,
            select: false
        },

        lastLoginAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);