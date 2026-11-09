import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, getOrders);
router.get("/:identifier", protect, getOrderById);
router.post(
  "/",
  protect,
  restrictTo("admin", "sales", "customer"),
  createOrder
);
router.put(
  "/:id",
  protect,
  restrictTo("admin", "sales", "accounting"),
  updateOrder
);

export default router;

