"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVehicles = GetVehicles;
exports.getVehiclesByCustomerIdFromDb = getVehiclesByCustomerIdFromDb;
exports.insertVehicle = insertVehicle;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle;
exports.getVehicleByCarNumberFromDb = getVehicleByCarNumberFromDb;
exports.deleteVehiclesByCustomerIdFromDb = deleteVehiclesByCustomerIdFromDb;
const mongodb_1 = require("mongodb");
const DB_INFO = {
    host: process.env.CONNECTION_STRING,
    db: process.env.DB_NAME,
    collection: 'Vehicle'
};
async function GetVehicles(query = {}, projection = {}) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close(); // Ensure proper closure
    }
}
async function getVehiclesByCustomerIdFromDb(customerId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        // חיפוש כל הרכבים שיש להם Customer_Id שמתאים
        const vehicles = await mongo.db(DB_INFO.db)
            .collection(DB_INFO.collection)
            .find({ Customer_Id: customerId }) // חיפוש לפי שדה Customer_Id
            .toArray();
        return vehicles; // מחזיר את כל הרכבים שמצא
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function insertVehicle(vehicle) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(vehicle);
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function updateVehicle(carNumber, updates) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne({ Car_Number: carNumber }, { $set: updates });
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function deleteVehicle(carNumber) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteOne({ Car_Number: carNumber });
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function getVehicleByCarNumberFromDb(carNumber) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const vehicle = await mongo.db(DB_INFO.db)
            .collection(DB_INFO.collection)
            .findOne({ Car_Number: carNumber });
        return vehicle;
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
// מחיקת כל הרכבים של הלקוח לפי מזהה
async function deleteVehiclesByCustomerIdFromDb(customerId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteMany({ Customer_Id: customerId.toString() });
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
//# sourceMappingURL=vehicle.db.js.map