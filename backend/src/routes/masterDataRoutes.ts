import { Router } from "express";
import {
  getByCategory,
  getAllMasterData,
  createMasterDataItem,
  updateMasterDataItem,
  deleteMasterDataItem,
} from "../controllers/masterDataController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

// Public/Read endpoints (can be read by frontend forms and dashboards)
router.get("/category/:category", getByCategory);
router.get("/all", protect, getAllMasterData);

// Protected mutation endpoints:
// All authorized departmental staff can create and maintain their respective dropdown taxonomies
router.post(
  "/",
  protect,
  restrictTo("admin", "sales", "procurement", "service", "parts", "operations", "hr", "accounting", "recon", "imports", "compliance"),
  createMasterDataItem
);

router.put(
  "/:id",
  protect,
  restrictTo("admin", "sales", "procurement", "service", "parts", "operations", "hr", "accounting", "recon", "imports", "compliance"),
  updateMasterDataItem
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin", "operations"),
  deleteMasterDataItem
);

export default router;

