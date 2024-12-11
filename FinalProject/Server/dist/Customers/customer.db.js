"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomers = GetCustomers;
exports.findCustomerByEmail = findCustomerByEmail;
exports.GetCustomerByEmail = GetCustomerByEmail;
exports.insertCustomer = insertCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
exports.updateCustomerVehiclesDb = updateCustomerVehiclesDb;
exports.getCustomerByEmail = getCustomerByEmail;
exports.getCustomerDetailsWithVehicles = getCustomerDetailsWithVehicles;
exports.pullVehicleFromCustomerArray = pullVehicleFromCustomerArray;
const mongodb_1 = require("mongodb");
const vehicle_db_1 = require("../vehicle/vehicle.db");
const DB_INFO = {
    host: process.env.CONNECTION_STRING,
    db: process.env.DB_NAME,
    collection: 'Customer'
};
async function GetCustomers(query = {}, projection = {}) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function findCustomerByEmail(email) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        // וודא שאתה שולף גם את ה-Salt
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne({ Email: email });
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function GetCustomerByEmail(email) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne({ Email: email });
        return result;
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function insertCustomer(customer) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(customer);
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function updateCustomer(customerId, updates) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        // עדכון מסמך הלקוח עם השדה החדש imageURL (במידה והועבר)
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne({ _id: customerId }, { $set: updates });
        return result;
    }
    catch (error) {
        console.error("Error in updateCustomer:", error);
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function deleteCustomer(customerId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteOne({ _id: customerId });
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function updateCustomerVehiclesDb(customerId, vehicleId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne({ _id: customerId }, { $addToSet: { Vehicles: vehicleId } } // שימוש ב-$addToSet כדי להוסיף את vehicleId
        );
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function getCustomerByEmail(email) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const query = { Email: email }; // חיפוש לפי האימייל
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne(query);
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function getCustomerDetailsWithVehicles(customerId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const customer = await mongo.db(DB_INFO.db)
            .collection(DB_INFO.collection)
            .findOne({ _id: new mongodb_1.ObjectId(customerId) });
        if (!customer)
            return null;
        // שליפת רשימת הרכבים של הלקוח
        const vehicles = await (0, vehicle_db_1.getVehiclesByCustomerIdFromDb)(customerId);
        return { ...customer, vehicles };
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
async function pullVehicleFromCustomerArray(customerId, vehicleId) {
    const mongo = new mongodb_1.MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne({ _id: customerId }, { $pull: { Vehicles: vehicleId } } // שימוש ב-any כדי להימנע מבעיות סוג
        );
    }
    catch (error) {
        throw error;
    }
    finally {
        await mongo.close();
    }
}
//# sourceMappingURL=customer.db.js.map