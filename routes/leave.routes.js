import { Router } from "express";
import {
  addLeave,
  getAllLeaves,
  getMyLeaves,
  pendingLeave,
  updateLeave,
} from "../controller/leave.controller.js";
import { verifyEmployeeJWT } from "../middleware/employee.middleware.js";
import { verifyJWT } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/add", verifyEmployeeJWT, addLeave);
router.get("/get", verifyEmployeeJWT, getMyLeaves);
router.get("/getall", verifyJWT, getAllLeaves);
router.get("/pending", verifyJWT, pendingLeave);
router.put("/update/:id", verifyJWT, updateLeave);

export default router;
