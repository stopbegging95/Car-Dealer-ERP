import { Router } from "express";
import { getVaultDocuments, createVaultDocument } from "../controllers/vaultController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "compliance", "operations", "sales"), getVaultDocuments);
router.post("/", protect, restrictTo("admin", "compliance"), createVaultDocument);

export default router;

