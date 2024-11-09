import jwt from "jsonwebtoken";
import { Employee } from "../model/employee.modules.js";

export const verifyEmployeeJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers("Authorization");
    if (!token) {
      return res.status(403).json({
        eror: "Token is missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);

    const employee = await Employee.findById(decodedToken?._id).select(
      "-password"
    );
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Invalid Access Token",
      });
    }
    req.employee = employee;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
