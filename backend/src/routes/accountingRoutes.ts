import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  recordInvoicePayment,
} from "../controllers/accountingController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "accounting", "sales"), getInvoices);
router.post("/", protect, restrictTo("admin", "accounting"), createInvoice);
router.patch("/:id/payment", protect, restrictTo("admin", "accounting"), recordInvoicePayment);

export default router;

