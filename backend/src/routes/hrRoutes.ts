import { Router } from "express";
import { getEmployees, createEmployee, clockInAttendance } from "../controllers/hrController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "hr"), getEmployees);
router.post("/", protect, restrictTo("admin", "hr"), createEmployee);
router.post("/:id/clock-in", protect, clockInAttendance);

export default router;

