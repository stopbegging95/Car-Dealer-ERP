import { Router } from "express";
import { getReconJobs, createReconJob, updateReconStage } from "../controllers/reconController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "recon", "operations", "sales"), getReconJobs);
router.post("/", protect, restrictTo("admin", "recon"), createReconJob);
router.patch("/:id/stage", protect, restrictTo("admin", "recon"), updateReconStage);

export default router;

