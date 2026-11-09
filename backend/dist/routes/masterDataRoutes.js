"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterDataController_js_1 = require("../controllers/masterDataController.js");
const auth_js_1 = require("../middlewares/auth.js");
const rbac_js_1 = require("../middlewares/rbac.js");
const router = (0, express_1.Router)();
// Public/Read endpoints (can be read by frontend forms and dashboards)
router.get("/category/:category", masterDataController_js_1.getByCategory);
router.get("/all", auth_js_1.protect, masterDataController_js_1.getAllMasterData);
// Protected mutation endpoints:
// All authorized departmental staff can create and maintain their respective dropdown taxonomies
router.post("/", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "sales", "procurement", "service", "parts", "operations", "hr", "accounting", "recon", "imports", "compliance"), masterDataController_js_1.createMasterDataItem);
router.put("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "sales", "procurement", "service", "parts", "operations", "hr", "accounting", "recon", "imports", "compliance"), masterDataController_js_1.updateMasterDataItem);
router.delete("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "operations"), masterDataController_js_1.deleteMasterDataItem);
exports.default = router;
