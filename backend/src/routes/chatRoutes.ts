import { Router } from "express";
import { getChatMessages, postChatMessage } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

// Staff internal chat routes (Customer strictly prohibited)
const STAFF_ROLES = [
  "admin",
  "accounting",
  "sales",
  "service",
  "parts",
  "financing",
  "recon",
  "inspection",
  "imports",
  "trade-ins",
  "crm",
  "hr",
  "procurement",
  "operations",
  "management",
  "compliance",
] as const;

router.get("/messages", protect, restrictTo(...STAFF_ROLES), getChatMessages);
router.post("/messages", protect, restrictTo(...STAFF_ROLES), postChatMessage);

export default router;

