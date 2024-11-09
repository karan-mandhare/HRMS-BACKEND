import { Router } from "express";
import {
  addSalary,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getCurrentEmployee,
  loginEmployee,
  logoutEmployee,
  searchEmployee,
  updateEmployee,
} from "../controller/employee.controller.js";
import { verifyJWT } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyEmployeeJWT } from "../middleware/employee.middleware.js";

const router = Router();

router.post(
  "/create",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  createEmployee
);
router.get("/list", verifyJWT, getAllEmployees);
router.put(
  "/edit/:id",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateEmployee
);
router.delete("/delete/:id", verifyJWT, deleteEmployee);
router.get("/employee/:id", verifyJWT, getCurrentEmployee);
router.get("/search", verifyJWT, searchEmployee);
router.put("/salary", verifyJWT, addSalary);

router.post("/login", loginEmployee);
router.post("/logout", verifyEmployeeJWT, logoutEmployee);

export default router;
