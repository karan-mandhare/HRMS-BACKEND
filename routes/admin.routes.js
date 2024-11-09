import { Router } from "express";
import {
  createAdmin,
  getCurrentAdmin,
  logOutAdmin,
  loginAdmin,
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/create-admin", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", verifyJWT, logOutAdmin);
router.get("/admin", verifyJWT, getCurrentAdmin);

export default router;
