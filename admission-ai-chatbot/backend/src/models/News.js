const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        category: {
            type: String,
            default: "admission"
        },

        publishedAt: {
            type: Date,
            default: Date.now
        },

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("News", newsSchema);