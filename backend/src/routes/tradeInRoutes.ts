import { Router } from "express";
import {
  getTradeIns,
  createTradeIn,
  updateTradeInValuation,
} from "../controllers/tradeInController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "tradeins", "sales"), getTradeIns);
router.post("/", protect, createTradeIn);
router.patch("/:id/valuation", protect, restrictTo("admin", "tradeins"), updateTradeInValuation);

export default router;

