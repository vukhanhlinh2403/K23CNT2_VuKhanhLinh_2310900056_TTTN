const Major = require("../models/Major");


// =====================================
// GET ALL MAJORS
// =====================================

const getAllMajors = async (req, res) => {

    try {

        const majors = await Major.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            count: majors.length,
            data: majors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================
// GET MAJOR BY ID
// =====================================

const getMajorById = async (req, res) => {

    try {

        const major = await Major.findById(
            req.params.id
        );

        if (!major) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ngành học"
            });

        }

        res.json({
            success: true,
            data: major
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================
// CREATE MAJOR
// =====================================

const createMajor = async (req, res) => {

    try {

        const {
            code,
            name,
            description,
            duration,
            tuition,
            career,
            subjects
        } = req.body;


        const existingMajor = await Major.findOne({
            code
        });


        if (existingMajor) {

            return res.status(400).json({
                success: false,
                message: "Mã ngành đã tồn tại"
            });

        }


        const major = await Major.create({
            code,
            name,
            description,
            duration,
            tuition,
            career,
            subjects
        });


        res.status(201).json({
            success: true,
            message: "Tạo ngành học thành công",
            data: major
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================
// UPDATE MAJOR
// =====================================

const updateMajor = async (req, res) => {

    try {

        const major = await Major.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!major) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ngành học"
            });

        }


        res.json({
            success: true,
            message: "Cập nhật thành công",
            data: major
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================
// DELETE MAJOR
// =====================================

const deleteMajor = async (req, res) => {

    try {

        const major = await Major.findByIdAndDelete(
            req.params.id
        );


        if (!major) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ngành học"
            });

        }


        res.json({
            success: true,
            message: "Xóa ngành học thành công"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    getAllMajors,
    getMajorById,
    createMajor,
    updateMajor,
    deleteMajor
};