const mongoose = require("mongoose");

// ======================================================
// SCHEMA THÔNG TIN NGÀNH HỌC
// ======================================================

const majorSchema = new mongoose.Schema(
    {
        // ==============================================
        // THÔNG TIN CƠ BẢN
        // ==============================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        // ==============================================
        // HỌC PHÍ
        // ==============================================

        tuition: {
            type: Number,
            default: null
        },

        // ==============================================
        // CƠ HỘI VIỆC LÀM
        // ==============================================

        jobOpportunities: {
            type: [String],
            default: []
        },

        // ==============================================
        // CƠ HỘI HỌC TẬP NÂNG CAO
        // ==============================================

        advancedStudy: {
            type: [String],
            default: []
        },

        // ==============================================
        // CHƯƠNG TRÌNH ĐÀO TẠO
        // ==============================================

        trainingProgram: {
            type: String,
            default: ""
        },

        // ==============================================
        // PHƯƠNG PHÁP GIẢNG DẠY
        // ==============================================

        teachingMethod: {
            type: String,
            default: ""
        },
studyDuration: {
    type: String,
    default: ""
},
        // ==============================================
        // VỊ TRÍ / NGHỀ NGHIỆP SAU KHI TỐT NGHIỆP
        // ==============================================

        careerPaths: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// ======================================================
// INDEX
// ======================================================

majorSchema.index({
    name: 1
});

majorSchema.index({
    code: 1
});

// ======================================================
// MODEL
// ======================================================

module.exports =
    mongoose.model("Major", majorSchema);