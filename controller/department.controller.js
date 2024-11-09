import { Department } from "../model/department.modules.js";

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    const uname = name.toUpperCase();
    const existDepartment = await Department.find({ name: uname });
    if (existDepartment.length > 0) {
      return res.status(300).json({
        success: false,
        message: "Department already exist",
      });
    }
    const department = await Department.create({
      name: uname,
    });

    if (!department) {
      return res.status(200).json({
        success: false,
        message: "Error while Adding Department.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Department Added Successfully.",
      department,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const manageDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    const uname = name.toUpperCase();
    const department = await Department.findByIdAndUpdate(
      id,
      { $set: { name: uname } },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findByIdAndDelete(id);
    if (!dept) {
      return res.status(400).json({
        success: false,
        message: "Error while deleting employee",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find({});
    if (!departments) {
      return res.status(400).json({
        success: false,
        message: "Error while getting employee",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      departments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createDepartment,
  manageDepartment,
  deleteDepartment,
  getAllDepartment,
};
