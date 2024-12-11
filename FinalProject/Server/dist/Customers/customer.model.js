"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getByEmail = getByEmail;
exports.addNewCustomer = addNewCustomer;
exports.updateCustomerDetails = updateCustomerDetails;
exports.removeCustomer = removeCustomer;
exports.findOrCreateCustomer = findOrCreateCustomer;
exports.removeVehicleFromCustomerArray = removeVehicleFromCustomerArray;
exports.findOrCreateCustomerWithGoogle = findOrCreateCustomerWithGoogle;
exports.updateCustomerVehicles = updateCustomerVehicles;
exports.getCustomerByIdWithVehicles = getCustomerByIdWithVehicles;
exports.deleteVehiclesByCustomerId = deleteVehiclesByCustomerId;
const customer_db_1 = require("./customer.db");
const vehicle_db_1 = require("../vehicle/vehicle.db");
async function getAll() {
    return await (0, customer_db_1.GetCustomers)();
}
async function getByEmail(email) {
    return await (0, customer_db_1.findCustomerByEmail)(email);
}
async function addNewCustomer(customer) {
    return await (0, customer_db_1.insertCustomer)(customer);
}
async function updateCustomerDetails(customerId, updates) {
    return await (0, customer_db_1.updateCustomer)(customerId, updates);
}
async function removeCustomer(customerId) {
    return await (0, customer_db_1.deleteCustomer)(customerId);
}
async function findOrCreateCustomer(data) {
    let customer = await (0, customer_db_1.GetCustomerByEmail)(data.email);
    if (!customer) {
        const newCustomer = {
            First_Name: data.given_name,
            Last_Name: data.family_name,
            Email: data.email,
            Password: '',
            Birth_Day: undefined,
            Driving_License: undefined
        };
        const result = await (0, customer_db_1.insertCustomer)(newCustomer);
        customer = await (0, customer_db_1.GetCustomerByEmail)(newCustomer.Email);
    }
    return customer;
}
async function removeVehicleFromCustomerArray(customerId, vehicleId) {
    try {
        await (0, customer_db_1.pullVehicleFromCustomerArray)(customerId, vehicleId); // קריאה לפונקציה שתעדכן את הלקוח
    }
    catch (error) {
        throw error;
    }
}
async function findOrCreateCustomerWithGoogle(data) {
    let customer = await (0, customer_db_1.GetCustomerByEmail)(data.email);
    if (!customer) {
        const newCustomer = {
            First_Name: '',
            Last_Name: '',
            Email: data.email,
            Password: data.Password,
            Birth_Day: undefined,
            Driving_License: undefined
        };
        const result = await (0, customer_db_1.insertCustomer)(newCustomer);
        customer = await (0, customer_db_1.GetCustomerByEmail)(newCustomer.Email);
    }
    return customer;
}
async function updateCustomerVehicles(customerId, vehicleId) {
    return await (0, customer_db_1.updateCustomerVehiclesDb)(customerId, vehicleId);
}
async function getCustomerByIdWithVehicles(customerId) {
    return await (0, customer_db_1.getCustomerDetailsWithVehicles)(customerId);
}
async function deleteVehiclesByCustomerId(customerId) {
    await (0, vehicle_db_1.deleteVehiclesByCustomerIdFromDb)(customerId); // פונקציה שתמחוק רכבים לפי מזהה הלקוח
}
//# sourceMappingURL=customer.model.js.map