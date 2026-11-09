import { Router } from "express";
import {
  getPublicCMSContent,
  getAllCMSContent,
  createCMSContent,
  updateCMSContent,
  deleteCMSContent,
} from "../controllers/cmsController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

// Public route for frontend homepage
router.get("/public", getPublicCMSContent);

// Admin / Marketing routes
router.get("/all", protect, restrictTo("admin", "marketing"), getAllCMSContent);
router.post("/", protect, restrictTo("admin", "marketing"), createCMSContent);
router.put("/:id", protect, restrictTo("admin", "marketing"), updateCMSContent);
router.delete("/:id", protect, restrictTo("admin", "marketing"), deleteCMSContent);

export default router;

