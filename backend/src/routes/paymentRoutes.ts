import { Router } from "express";
import {
  initializePaystack,
  verifyPaystack,
  handlePaystackWebhook,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/initialize", protect, initializePaystack);
router.get("/verify/:reference", verifyPaystack);
router.post("/webhook", handlePaystackWebhook);

export default router;

