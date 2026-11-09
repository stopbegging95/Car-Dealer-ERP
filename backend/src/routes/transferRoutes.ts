import { Router } from "express";
import {
  getTransfers,
  createTransfer,
  acknowledgeTransferReceipt,
} from "../controllers/transferController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "operations", "sales"), getTransfers);
router.post("/", protect, restrictTo("admin", "operations"), createTransfer);
router.patch("/:id/receive", protect, restrictTo("admin", "operations"), acknowledgeTransferReceipt);

export default router;

