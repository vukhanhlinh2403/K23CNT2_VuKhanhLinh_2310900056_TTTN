const mongoose = require("mongoose");

// Schema lưu thông tin tuyển sinh
const admissionSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true
        },

        major: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Major",
            required: true
        },

        method: {
            type: String,
            required: true
        },

        score: {
            type: Number
        },

        quota: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

// Tạo Model Admission
module.exports = mongoose.model("Admission", admissionSchema);