"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehicles = getAllVehicles;
exports.getVehiclesByCustomerId = getVehiclesByCustomerId;
exports.addVehicle = addVehicle;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle;
exports.getVehicleByCarNumber = getVehicleByCarNumber;
const vehicle_model_1 = require("./vehicle.model");
const mongodb_1 = require("mongodb");
const vehicle_db_1 = require("./vehicle.db");
const customer_model_1 = require("../Customers/customer.model");
async function getAllVehicles(req, res) {
    try {
        const vehicles = await (0, vehicle_model_1.getAll)();
        console.log("Vehicles data:", vehicles); // Log the data
        res.status(200).json({ vehicles });
    }
    catch (error) {
        console.error("Error getting all vehicles:", error);
        res.status(500).json({ error });
    }
}
async function getVehiclesByCustomerId(req, res) {
    const { customerId } = req.params; // נשלוף את ה-Customer_Id מה-URL
    try {
        const vehicles = await (0, vehicle_db_1.getVehiclesByCustomerIdFromDb)(customerId); // קריאה לפונקציה שתבצע את החיפוש
        if (vehicles && vehicles.length > 0) {
            res.status(200).json({ vehicles });
        }
        else {
            res.status(404).json({ message: 'No vehicles found for this customer' });
        }
    }
    catch (error) {
        console.error("Error getting vehicles by customer ID:", error);
        res.status(500).json({ error });
    }
}
async function addVehicle(req, res) {
    const newVehicle = req.body;
    const customerId = newVehicle.Customer_Id;
    console.log('Received vehicle details:', newVehicle); // לוג כל הנתונים, כולל imageURL
    console.log('Image URL:', newVehicle.imageURL); // בדיקה ספציפית לשדה imageURL
    try {
        if (!customerId) {
            console.error('Customer ID is missing');
            return res.status(400).json({ message: 'Customer ID is required' });
        }
        const result = await (0, vehicle_model_1.addNewVehicle)(newVehicle, new mongodb_1.ObjectId(customerId));
        res.status(201).json({ message: 'Vehicle added successfully', result });
    }
    catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ error });
    }
}
async function updateVehicle(req, res) {
    const { carNumber } = req.params;
    const updates = req.body;
    // אפשרות לעדכון השדות המותרים בלבד
    const allowedUpdates = ['Car_Number', 'Manufacturer', 'Year_of_Manufacture', 'Color', 'Number_Of_Kilometers', 'Insurance_Expiration', 'Model', 'insuranceUrl'];
    const keys = Object.keys(updates);
    const isValidUpdate = keys.every(key => allowedUpdates.includes(key));
    if (!isValidUpdate) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }
    try {
        const result = await (0, vehicle_model_1.updateVehicleDetails)(carNumber, updates);
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Vehicle updated successfully', result });
        }
        else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    }
    catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ error });
    }
}
async function deleteVehicle(req, res) {
    const { carNumber } = req.params;
    try {
        const vehicle = await (0, vehicle_model_1.findVehicleByCarNumber)(carNumber);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        // בדיקת תקינות Customer_Id
        if (!vehicle.Customer_Id) {
            return res.status(400).json({ message: 'Customer ID is missing for this vehicle' });
        }
        const result = await (0, vehicle_model_1.removeVehicle)(carNumber);
        if (result.deletedCount > 0) {
            await (0, customer_model_1.removeVehicleFromCustomerArray)(new mongodb_1.ObjectId(vehicle.Customer_Id), vehicle._id); // הוספנו המרה בטוחה ל-ObjectId
            res.status(200).json({ message: 'Vehicle deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    }
    catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ error });
    }
}
async function getVehicleByCarNumber(req, res) {
    const { carNumber } = req.params;
    try {
        const vehicle = await (0, vehicle_model_1.findVehicleByCarNumber)(carNumber);
        if (vehicle) {
            res.status(200).json({ vehicle });
        }
        else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
//# sourceMappingURL=vehicle.controller.js.map