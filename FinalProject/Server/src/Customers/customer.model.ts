import { ObjectId } from "mongodb";
import { GetCustomers, GetCustomerByEmail, insertCustomer, updateCustomer, deleteCustomer, findCustomerByEmail, updateCustomerVehiclesDb, getCustomerDetailsWithVehicles, pullVehicleFromCustomerArray } from "./customer.db";
import { Customer } from "./customer.type";
import { deleteVehiclesByCustomerIdFromDb } from "../vehicle/vehicle.db";

export async function getAll() {
    return await GetCustomers();
}

export async function getByEmail(email: string) {
    return await findCustomerByEmail(email);
}

export async function addNewCustomer(customer: Customer) {
    return await insertCustomer(customer);
}

export async function updateCustomerDetails(customerId: ObjectId, updates: Partial<Customer>) {
    return await updateCustomer(customerId, updates);
}
export async function removeCustomer(customerId: ObjectId) {
    return await deleteCustomer(customerId);
}

export async function findOrCreateCustomer(data: any): Promise<Customer> {
    let customer = await GetCustomerByEmail(data.email);

    if (!customer) {
        const newCustomer: Customer = {
            First_Name: data.given_name,
            Last_Name: data.family_name,
            Email: data.email,
            Password: '',
            Birth_Day: undefined,
            Driving_License: undefined
        };

        const result = await insertCustomer(newCustomer);
        customer = await GetCustomerByEmail(newCustomer.Email) as Customer;
    }

    return customer;
}

export async function removeVehicleFromCustomerArray(customerId: ObjectId, vehicleId: ObjectId) {
    try {
        await pullVehicleFromCustomerArray(customerId, vehicleId);  // קריאה לפונקציה שתעדכן את הלקוח
    } catch (error) {
        throw error;
    }
}
export async function findOrCreateCustomerWithGoogle(data: any): Promise<Customer> {
    let customer = await GetCustomerByEmail(data.email);

    if (!customer) {
        const newCustomer: Customer = {
            First_Name: '',
            Last_Name: '',
            Email: data.email,
            Password: data.Password,  
            Birth_Day: undefined,
            Driving_License: undefined
        };

        const result = await insertCustomer(newCustomer);
        customer = await GetCustomerByEmail(newCustomer.Email) as Customer;
    }

    return customer;
}

export async function updateCustomerVehicles(customerId: ObjectId, vehicleId: ObjectId) {
    return await updateCustomerVehiclesDb(customerId, vehicleId);
}

export async function getCustomerByIdWithVehicles(customerId: string) {
    return await getCustomerDetailsWithVehicles(customerId);
}


export async function deleteVehiclesByCustomerId(customerId: ObjectId) {
    await deleteVehiclesByCustomerIdFromDb(customerId);  // פונקציה שתמחוק רכבים לפי מזהה הלקוח
}