import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartment,
  manageDepartment,
} from "../controller/department.controller.js";
import { verifyJWT } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/add", verifyJWT, createDepartment);
router.put("/manage/:id", verifyJWT, manageDepartment);
router.delete("/delete/:id", verifyJWT, deleteDepartment);
router.get("/list", verifyJWT, getAllDepartment);

export default router;
