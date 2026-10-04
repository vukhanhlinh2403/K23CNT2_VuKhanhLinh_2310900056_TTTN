const Major = require("../models/major.model");

// Lấy danh sách ngành
const getMajors = async (req, res) => {
    try {
        const majors = await Major.find();

        res.json({
            success: true,
            data: majors
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Thêm ngành
const createMajor = async (req, res) => {
    try {
        const major = await Major.create(req.body);

        res.status(201).json({
            success: true,
            data: major
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getMajors,
    createMajor
};