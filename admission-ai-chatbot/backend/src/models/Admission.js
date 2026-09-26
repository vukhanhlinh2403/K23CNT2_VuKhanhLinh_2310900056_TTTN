const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true
        },

        method: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        requirements: {
            type: [String],
            default: []
        },

        documents: {
            type: [String],
            default: []
        },

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
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

module.exports = mongoose.model("Admission", admissionSchema);