import { Router } from "express";
import {
  getCRMClients,
  createCRMClient,
  addClientInquiryOrTicket,
} from "../controllers/crmController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "crm", "sales"), getCRMClients);
router.post("/", protect, restrictTo("admin", "crm", "sales"), createCRMClient);
router.post("/:id/interactions", protect, addClientInquiryOrTicket);

export default router;

