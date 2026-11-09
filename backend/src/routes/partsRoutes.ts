import { Router } from "express";
import { getParts, createPart, updatePartStock } from "../controllers/partsController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";

const router = Router();

router.get("/", protect, restrictTo("admin", "parts", "service", "procurement"), getParts);
router.post("/", protect, restrictTo("admin", "parts"), createPart);
router.patch("/:id/stock", protect, restrictTo("admin", "parts", "service"), updatePartStock);

export default router;

