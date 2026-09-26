const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        duration: {
            type: Number,
            default: 4
        },

        tuition: {
            type: Number,
            default: 0
        },

        career: {
            type: [String],
            default: []
        },

        subjects: {
            type: [String],
            default: []
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Major", majorSchema);