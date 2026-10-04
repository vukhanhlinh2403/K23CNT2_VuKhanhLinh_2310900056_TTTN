const Admission = require("../models/admission.model");

// ============================
// LẤY DANH SÁCH TUYỂN SINH
// ============================
const getAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find()
            .populate("major");

        res.json({
            success: true,
            data: admissions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================
// LẤY TUYỂN SINH THEO ID
// ============================
const getAdmissionById = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id)
            .populate("major");

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin tuyển sinh"
            });
        }

        res.json({
            success: true,
            data: admission
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================
// THÊM THÔNG TIN TUYỂN SINH
// ============================
const createAdmission = async (req, res) => {
    try {
        const admission = await Admission.create(req.body);

        res.status(201).json({
            success: true,
            data: admission
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ============================
// XÓA THÔNG TIN TUYỂN SINH
// ============================
const deleteAdmission = async (req, res) => {
    try {
        const admission = await Admission.findByIdAndDelete(
            req.params.id
        );

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy dữ liệu"
            });
        }

        res.json({
            success: true,
            message: "Xóa thành công"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật thông tin tuyển sinh
const updateAdmission = async (req, res) => {
    try {
        // Tìm bản ghi theo ID và cập nhật dữ liệu
        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin tuyển sinh"
            });
        }

        res.json({
            success: true,
            data: admission
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    getAdmissions,
    getAdmissionById,
    createAdmission,
    updateAdmission,
    deleteAdmission
};