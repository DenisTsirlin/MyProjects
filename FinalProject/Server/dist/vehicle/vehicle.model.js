"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.addNewVehicle = addNewVehicle;
exports.updateVehicleDetails = updateVehicleDetails;
exports.removeVehicle = removeVehicle;
exports.findVehicleByCarNumber = findVehicleByCarNumber;
const customer_model_1 = require("../Customers/customer.model");
const vehicle_db_1 = require("./vehicle.db");
async function getAll() {
    return await (0, vehicle_db_1.GetVehicles)();
}
async function addNewVehicle(vehicle, customerId) {
    let result = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${vehicle.Car_Number}`);
    let data = await result.json();
    vehicle.Model = data.result.records[0].kinuy_mishari;
    vehicle.Color = data.result.records[0].tzeva_rechev;
    vehicle.Year_of_Manufacture = data.result.records[0].shnat_yitzur;
    const insertedVehicle = await (0, vehicle_db_1.insertVehicle)(vehicle);
    if (insertedVehicle.insertedId) {
        await (0, customer_model_1.updateCustomerVehicles)(customerId, insertedVehicle.insertedId);
    }
    return insertedVehicle;
}
async function updateVehicleDetails(carNumber, updates) {
    return await (0, vehicle_db_1.updateVehicle)(carNumber, updates);
}
async function removeVehicle(carNumber) {
    return await (0, vehicle_db_1.deleteVehicle)(carNumber);
}
async function findVehicleByCarNumber(carNumber) {
    return await (0, vehicle_db_1.getVehicleByCarNumberFromDb)(carNumber);
}
//# sourceMappingURL=vehicle.model.js.map