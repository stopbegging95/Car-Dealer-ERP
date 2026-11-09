import { Router } from "express";
import { register, login, getMe, logout, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/rbac.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.get("/users", protect, restrictTo("admin", "hr"), getAllUsers);

export default router;

