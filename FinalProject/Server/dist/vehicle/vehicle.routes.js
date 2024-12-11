"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const VehicleRouter = (0, express_1.Router)();
VehicleRouter.get('/', vehicle_controller_1.getAllVehicles);
VehicleRouter.get('/customer/:customerId', vehicle_controller_1.getVehiclesByCustomerId);
VehicleRouter.get('/number/:carNumber', vehicle_controller_1.getVehicleByCarNumber);
VehicleRouter.post('/', vehicle_controller_1.addVehicle);
VehicleRouter.put('/:carNumber', vehicle_controller_1.updateVehicle);
VehicleRouter.delete('/:carNumber', vehicle_controller_1.deleteVehicle);
exports.default = VehicleRouter;
//# sourceMappingURL=vehicle.routes.js.map