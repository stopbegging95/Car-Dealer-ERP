import { Router } from "express";
import { getInspections, createInspection } from "../controllers/inspectionController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "inspection", "sales", "operations"), getInspections);
router.post("/", protect, restrictTo("admin", "inspection"), createInspection);

export default router;

