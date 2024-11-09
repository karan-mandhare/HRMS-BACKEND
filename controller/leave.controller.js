import { Leave } from "../model/leave.modules.js";

const addLeave = async (req, res) => {
  try {
    const { reason, startdate, enddate, desc } = req.body;
    const employee = req.employee;

    if (!reason || !startdate || !enddate || !desc || !employee) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      name: employee.name,
      photo: employee.photo,
      department: employee.department,
      reason,
      startdate,
      enddate,
      desc,
    });

    if (!leave) {
      return res.status(403).json({
        success: false,
        message: "Error while adding leave",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Leave added successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const employee = req.employee;
    const leaves = await Leave.find({ name: employee.name });
    if (!leaves) {
      return res.status(403).json({
        success: false,
        message: "Leaves not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      leaves,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const pendingLeave = async (req, res) => {
  try {
    const leave = await Leave.find({ status: "pending" });
    if (!leave) {
      return res.status(403).json({
        success: false,
        message: "Error while getting pending leaves",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Pending leaves fetched successfully",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(403).json({
        success: false,
        message: "status is required",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!leave) {
      return res.status(403).json({
        success: false,
        message: `Error while changing status`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `application ${status}`,
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const response = await Leave.find({});
    const leave = response?.filter((it) => it.status !== "pending");
    if (!leave) {
      return res.status(403).json({
        success: false,
        message: `Error while getting leaves`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `leaves fetched successfully`,
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { addLeave, getMyLeaves, pendingLeave, updateLeave, getAllLeaves };
