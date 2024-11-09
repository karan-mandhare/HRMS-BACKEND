import { Employee } from "../model/employee.modules.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokens = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    const accessToken = employee.generateAccessToken();

    await employee.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      department,
      gender,
      email,
      mobile,
      dob,
      doj,
      city,
      state,
      country,
      address,
    } = req.body;

    if (
      !name ||
      !department ||
      !gender ||
      !email ||
      !mobile ||
      !dob ||
      !doj ||
      !city ||
      !state ||
      !country ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if files are attached to the request
    if (!req.files || !req.files.photo || req.files.photo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const validFormats = ["image/jpeg", "image/png"];
    if (!validFormats.includes(req.files?.photo[0]?.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG and PNG images are allowed",
      });
    }

    const existedEmployee = await Employee.findOne({
      $or: [{ email, mobile }],
    });

    if (existedEmployee) {
      return res.status(300).json({
        success: false,
        message: "Employee with the same email and mobile already exists",
      });
    }

    const img_local_path = req.files?.photo[0]?.path;
    if (!img_local_path) {
      return res.status(300).json({
        success: false,
        message: "Image is required",
      });
    }

    const profile = await uploadOnCloudinary(img_local_path);
    if (!profile.url) {
      return res.status(300).json({
        success: false,
        message: "Error while uploading image",
      });
    }

    const password = mobile;

    const employee = await Employee.create({
      name,
      department,
      gender,
      email,
      mobile,
      dob,
      doj,
      city,
      state,
      country,
      address,
      password,
      photo: profile.url,
    });
    const createdEmployee = await Employee.findById(employee._id).select(
      "-password"
    );

    if (!createdEmployee) {
      return res.status(409).json({
        success: false,
        message: "Error while creating employee",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      createdEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employee_list = await Employee.find({}).select("-password");
    if (!employee_list) {
      return res.status(400).json({
        success: false,
        message: "Error while getting employee",
        employee_list,
      });
    }
    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee_list,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      department,
      gender,
      email,
      mobile,
      dob,
      doj,
      city,
      state,
      country,
      address,
    } = req.body;

    if (
      !name ||
      !department ||
      !gender ||
      !email ||
      !mobile ||
      !dob ||
      !doj ||
      !city ||
      !state ||
      !country ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || !req.files.photo || req.files.photo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const img_local_path = req.files?.photo[0]?.path;
    if (!img_local_path) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const validFormats = ["image/jpeg", "image/png"];
    if (!validFormats.includes(req.files?.photo[0]?.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG and PNG images are allowed",
      });
    }

    const profile = await uploadOnCloudinary(img_local_path);
    if (!profile.url) {
      return res.status(500).json({
        success: false,
        message: "Error while uploading image",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          department: department,
          gender: gender,
          email: email,
          mobile: mobile,
          dob: dob,
          doj: doj,
          city: city,
          state: state,
          country: country,
          address: address,
          photo: profile.url,
        },
      },
      { new: true }
    );

    const updatedEmployee = await Employee.findById(employee._id).select(
      "-password"
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCurrentEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id }).select("-password");
    if (!employee) {
      return res.status(409).json({
        success: false,
        message: "Error while getting employee",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const searchEmployee = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is missing or invalid",
      });
    }

    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
      ],
    };

    const data = await Employee.find(searchCriteria).select("-password");

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found matching the search query.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employees found successfully.",
      employees: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching employees",
      error,
    });
  }
};

const addSalary = async (req, res) => {
  try {
    const { _id, salary } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      _id,
      { $set: { salary: salary } },
      { new: true }
    );

    const updatedEmployee = await Employee.findById(employee._id).select(
      "-password"
    );
    if (!updatedEmployee) {
      return res.status(400).json({
        success: false,
        message: "Error while updating salary",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      updatedEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "email is invalid",
      });
    }

    const isPasswordValid = await employee.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const { accessToken } = await generateAccessTokens(employee._id);

    const loggedInEmployee = await Employee.findById(employee._id).select(
      "-password"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        employee: [loggedInEmployee, accessToken],
        message: "Employee logged In Successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.employee._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).clearCookie("accessToken", options).json({
      success: true,
      message: "Employee logged out successfully",
      employee: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCurrentEmployee,
  searchEmployee,
  addSalary,
  loginEmployee,
  logoutEmployee,
};
