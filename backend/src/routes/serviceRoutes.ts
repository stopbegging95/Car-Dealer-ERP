import { Router } from "express";
import {
  getServiceJobCards,
  createServiceJobCard,
  updateServiceJobStatus,
} from "../controllers/serviceController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "service", "operations", "accounting"), getServiceJobCards);
router.post("/", protect, restrictTo("admin", "service"), createServiceJobCard);
router.patch("/:id/status", protect, restrictTo("admin", "service"), updateServiceJobStatus);

export default router;

