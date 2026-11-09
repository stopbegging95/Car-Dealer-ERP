"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cmsController_js_1 = require("../controllers/cmsController.js");
const auth_js_1 = require("../middlewares/auth.js");
const rbac_js_1 = require("../middlewares/rbac.js");
const router = (0, express_1.Router)();
// Public route for frontend homepage
router.get("/public", cmsController_js_1.getPublicCMSContent);
// Admin / Marketing routes
router.get("/all", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "marketing"), cmsController_js_1.getAllCMSContent);
router.post("/", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "marketing"), cmsController_js_1.createCMSContent);
router.put("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "marketing"), cmsController_js_1.updateCMSContent);
router.delete("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "marketing"), cmsController_js_1.deleteCMSContent);
exports.default = router;
