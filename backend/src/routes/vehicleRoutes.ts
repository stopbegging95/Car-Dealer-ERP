import { Router } from "express";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
  getVehicleTelemetry,
} from "../controllers/vehicleController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

// Public / Read access
router.get("/", getVehicles);
router.get("/telemetry", protect, getVehicleTelemetry);
router.get("/:identifier", getVehicleById);

// Staff / Administrative mutations
router.post(
  "/",
  protect,
  restrictTo("admin", "sales", "procurement", "operations"),
  createVehicle
);

router.put(
  "/:id",
  protect,
  restrictTo("admin", "sales", "procurement", "operations", "recon"),
  updateVehicle
);

router.patch(
  "/:id/status",
  protect,
  restrictTo("admin", "sales", "procurement", "operations", "recon", "inspection"),
  updateVehicleStatus
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  deleteVehicle
);

export default router;

