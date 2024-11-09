import { Admin } from "../model/admin.modules.js";

const generateAccessTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();

    await admin.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      }); 
    }

    const existedAdmin = await Admin.findOne({});

    if (existedAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already registered. Please login",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      registered: true,
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password");

    if (!createdAdmin) {
      res.status(201).json({
        success: false,
        message: "Error while creating admin",
      });
    }

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      createdAdmin,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or password are required",
      });
    }

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "email is invalid",
      });
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // generate jwt token containing adminid
    const { accessToken } = await generateAccessTokens(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        admin: [loggedInAdmin, accessToken],
        message: "Admin logged In Successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logOutAdmin = async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin._id);

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).clearCookie("accessToken", options).json({
    success: true,
    message: "Admin logged out successfully",
    admin: [],
  });
};

const getCurrentAdmin = (req, res) => {
  try {
    const admin = req.admin;
    if (admin) {
      return res.status(201).json({
        success: true,
        message: "Admin fetched successfully",
        admin,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { createAdmin, loginAdmin, logOutAdmin, getCurrentAdmin };
