import { DeleteResult, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb";
import { Vehicle } from "./vehicle.type";

const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    collection: 'Vehicle'
};

export async function GetVehicles(query = {}, projection = {}) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        throw error;
    } finally {
        await mongo.close(); // Ensure proper closure
    }
}

export async function getVehiclesByCustomerIdFromDb(customerId: string) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        
        // חיפוש כל הרכבים שיש להם Customer_Id שמתאים
        const vehicles = await mongo.db(DB_INFO.db)
            .collection(DB_INFO.collection)
            .find({ Customer_Id: customerId })  // חיפוש לפי שדה Customer_Id
            .toArray();
        
        return vehicles;  // מחזיר את כל הרכבים שמצא
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}



export async function insertVehicle(vehicle: Vehicle): Promise<InsertOneResult<Vehicle>> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(vehicle);
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function updateVehicle(carNumber: string, updates: Partial<Vehicle>): Promise<UpdateResult> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            { Car_Number: carNumber },
            { $set: updates }
        );
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}


export async function deleteVehicle(carNumber: string): Promise<DeleteResult> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteOne({ Car_Number: carNumber });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function getVehicleByCarNumberFromDb(carNumber: string): Promise<Vehicle | null> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const vehicle = await mongo.db(DB_INFO.db)
            .collection<Vehicle>(DB_INFO.collection)
            .findOne({ Car_Number: carNumber });
        return vehicle;
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}


// מחיקת כל הרכבים של הלקוח לפי מזהה
export async function deleteVehiclesByCustomerIdFromDb(customerId: ObjectId) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteMany({ Customer_Id: customerId.toString() });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}
