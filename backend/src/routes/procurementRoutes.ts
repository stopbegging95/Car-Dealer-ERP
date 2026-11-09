import { Router } from "express";
import {
  getProcurements,
  createProcurement,
  approveHighValueProcurement,
} from "../controllers/procurementController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "procurement", "accounting"), getProcurements);
router.post("/", protect, restrictTo("admin", "procurement"), createProcurement);
router.patch("/:id/approve-high-value", protect, restrictTo("admin"), approveHighValueProcurement);

export default router;

