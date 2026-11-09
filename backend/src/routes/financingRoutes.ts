import { Router } from "express";
import {
  getFinancingApplications,
  createFinancingApplication,
  updateFinancingStatus,
} from "../controllers/financingController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "financing", "sales"), getFinancingApplications);
router.post("/", protect, createFinancingApplication);
router.patch("/:id/status", protect, restrictTo("admin", "financing"), updateFinancingStatus);

export default router;

