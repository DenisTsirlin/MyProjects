import { DeleteResult, InsertOneResult, MongoClient, UpdateResult, ObjectId } from "mongodb";
import { Customer } from "./customer.type";
import { getVehiclesByCustomerIdFromDb } from "../vehicle/vehicle.db";


const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    collection: 'Customer'
};

export async function GetCustomers(query = {}, projection = {}) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function findCustomerByEmail(email: string) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        // וודא שאתה שולף גם את ה-Salt
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne({ Email: email });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function GetCustomerByEmail(email: string): Promise<Customer | null> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne({ Email: email });
        return result as Customer | null;
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function insertCustomer(customer: Customer): Promise<InsertOneResult<Customer>> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(customer);
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function updateCustomer(customerId: ObjectId, updates: Partial<Customer>) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        
        // עדכון מסמך הלקוח עם השדה החדש imageURL (במידה והועבר)
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            { _id: customerId },
            { $set: updates }
        );

        return result;
    } catch (error) {
        console.error("Error in updateCustomer:", error);
        throw error;
    } finally {
        await mongo.close();
    }
}


export async function deleteCustomer(customerId: ObjectId): Promise<DeleteResult> {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).deleteOne({ _id: customerId });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}


export async function updateCustomerVehiclesDb(customerId: ObjectId, vehicleId: ObjectId) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            { _id: customerId },
            { $addToSet: { Vehicles: vehicleId } } // שימוש ב-$addToSet כדי להוסיף את vehicleId
        );
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}



export async function getCustomerByEmail(email: string) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const query = { Email: email }; // חיפוש לפי האימייל
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne(query);
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function getCustomerDetailsWithVehicles(customerId: string) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        
        const customer = await mongo.db(DB_INFO.db)
            .collection<Customer>(DB_INFO.collection)
            .findOne({ _id: new ObjectId(customerId) });

        if (!customer) return null;

        // שליפת רשימת הרכבים של הלקוח
        const vehicles = await getVehiclesByCustomerIdFromDb(customerId);
        
        return { ...customer, vehicles };
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

export async function pullVehicleFromCustomerArray(customerId: ObjectId, vehicleId: ObjectId) {
    const mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            { _id: customerId },
            { $pull: { Vehicles: vehicleId as any } } // שימוש ב-any כדי להימנע מבעיות סוג
        );
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}



