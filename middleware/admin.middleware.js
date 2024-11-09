import jwt from "jsonwebtoken";
import { Admin } from "../model/admin.modules.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers("Authorization");
    if (!token) {
      return res.status(403).json({ error: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);

    const admin = await Admin.findById(decodedToken?._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Invalid Access Token",
      });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
