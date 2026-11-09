"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_js_1 = require("../controllers/vehicleController.js");
const auth_js_1 = require("../middlewares/auth.js");
const rbac_js_1 = require("../middlewares/rbac.js");
const router = (0, express_1.Router)();
// Public / Read access
router.get("/", vehicleController_js_1.getVehicles);
router.get("/telemetry", auth_js_1.protect, vehicleController_js_1.getVehicleTelemetry);
router.get("/:identifier", vehicleController_js_1.getVehicleById);
// Staff / Administrative mutations
router.post("/", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "sales", "procurement", "operations"), vehicleController_js_1.createVehicle);
router.put("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "sales", "procurement", "operations", "recon"), vehicleController_js_1.updateVehicle);
router.patch("/:id/status", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin", "sales", "procurement", "operations", "recon", "inspection"), vehicleController_js_1.updateVehicleStatus);
router.delete("/:id", auth_js_1.protect, (0, rbac_js_1.restrictTo)("admin"), vehicleController_js_1.deleteVehicle);
exports.default = router;
