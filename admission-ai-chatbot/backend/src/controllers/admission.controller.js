const Admission = require("../models/Admission");

const getAllAdmissions = async (req, res, next) => {
  try {
    const items = await Admission.find({ isActive: true }).sort({ year: -1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const getAdmissionById = async (req, res, next) => {
  try {
    const item = await Admission.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức tuyển sinh"
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const createAdmission = async (req, res, next) => {
  try {
    const { year, method, description, requirements, documents, deadline, isActive } = req.body;

    if (!year || !method || !description) {
      return res.status(400).json({
        success: false,
        message: "year, method và description là bắt buộc"
      });
    }

    const item = await Admission.create({
      year,
      method,
      description,
      requirements: requirements || [],
      documents: documents || [],
      deadline: deadline || "",
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: "Tạo phương thức tuyển sinh thành công",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmission = async (req, res, next) => {
  try {
    const item = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức tuyển sinh"
      });
    }

    res.json({
      success: true,
      message: "Cập nhật phương thức tuyển sinh thành công",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmission = async (req, res, next) => {
  try {
    const item = await Admission.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức tuyển sinh"
      });
    }

    res.json({
      success: true,
      message: "Xóa phương thức tuyển sinh thành công"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission
};
