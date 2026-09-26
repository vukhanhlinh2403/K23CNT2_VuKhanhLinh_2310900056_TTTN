const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        content: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);


const chatHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        sessionId: {
            type: String,
            required: true
        },

        messages: {
            type: [messageSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "ChatHistory",
    chatHistorySchema
);