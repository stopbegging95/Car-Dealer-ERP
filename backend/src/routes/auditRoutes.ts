import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "compliance"), getAuditLogs);

export default router;

