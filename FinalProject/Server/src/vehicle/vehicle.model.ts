import { ObjectId } from "mongodb";
import { updateCustomerVehicles } from "../Customers/customer.model";
import { GetVehicles, insertVehicle, updateVehicle, deleteVehicle, getVehicleByCarNumberFromDb, } from "./vehicle.db";
import { Vehicle } from "./vehicle.type";


export async function getAll() {
    return await GetVehicles();
}



export async function addNewVehicle(vehicle: Vehicle, customerId: ObjectId) {

    let result = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${vehicle.Car_Number}`)

    let data = await result.json();

    vehicle.Model = data.result.records[0].kinuy_mishari
    vehicle.Color = data.result.records[0].tzeva_rechev
    vehicle.Year_of_Manufacture = data.result.records[0].shnat_yitzur
    const insertedVehicle = await insertVehicle(vehicle);
    if (insertedVehicle.insertedId) {
        await updateCustomerVehicles(customerId, insertedVehicle.insertedId);
    }
    return insertedVehicle;
}



export async function updateVehicleDetails(carNumber: string, updates: Partial<Vehicle>) {
    return await updateVehicle(carNumber, updates);
}


export async function removeVehicle(carNumber: string) {
    return await deleteVehicle(carNumber);
}

export async function findVehicleByCarNumber(carNumber: string) {
    return await getVehicleByCarNumberFromDb(carNumber);
}



