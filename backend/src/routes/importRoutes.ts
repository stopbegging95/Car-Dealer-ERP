import { Router } from "express";
import {
  getShipments,
  createShipment,
  updateShipmentClearingStatus,
} from "../controllers/importController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "imports", "operations", "procurement"), getShipments);
router.post("/", protect, restrictTo("admin", "imports"), createShipment);
router.patch("/:id/status", protect, restrictTo("admin", "imports"), updateShipmentClearingStatus);

export default router;

