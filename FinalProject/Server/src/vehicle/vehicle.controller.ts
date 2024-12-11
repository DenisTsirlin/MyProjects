import { Request, Response } from 'express';
import {  addNewVehicle, findVehicleByCarNumber, getAll, removeVehicle, updateVehicleDetails,   } from './vehicle.model';
import { Vehicle } from './vehicle.type';
import { ObjectId } from 'mongodb';
import { getVehiclesByCustomerIdFromDb } from './vehicle.db';
import { removeVehicleFromCustomerArray } from '../Customers/customer.model';

export async function getAllVehicles(req: Request, res: Response) {
    try {
        const vehicles = await getAll();
        console.log("Vehicles data:", vehicles); // Log the data
        res.status(200).json({ vehicles });
    } catch (error) {
        console.error("Error getting all vehicles:", error);
        res.status(500).json({ error });
    }
}

export async function getVehiclesByCustomerId(req: Request, res: Response) {
    const { customerId } = req.params;  // נשלוף את ה-Customer_Id מה-URL
    try {
        const vehicles = await getVehiclesByCustomerIdFromDb(customerId);  // קריאה לפונקציה שתבצע את החיפוש
        if (vehicles && vehicles.length > 0) {
            res.status(200).json({ vehicles });
        } else {
            res.status(404).json({ message: 'No vehicles found for this customer' });
        }
    } catch (error) {
        console.error("Error getting vehicles by customer ID:", error);
        res.status(500).json({ error });
    }
}

export async function addVehicle(req: Request, res: Response) {
    const newVehicle: Vehicle = req.body;
    const customerId = newVehicle.Customer_Id;
    console.log('Received vehicle details:', newVehicle); // לוג כל הנתונים, כולל imageURL
    console.log('Image URL:', newVehicle.imageURL); // בדיקה ספציפית לשדה imageURL

    try {
        if (!customerId) {
            console.error('Customer ID is missing');
            return res.status(400).json({ message: 'Customer ID is required' });
        }
        
        const result = await addNewVehicle(newVehicle, new ObjectId(customerId));
        res.status(201).json({ message: 'Vehicle added successfully', result });
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ error });
    }
}





export async function updateVehicle(req: Request, res: Response) {
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
        const result = await updateVehicleDetails(carNumber, updates);
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Vehicle updated successfully', result });
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ error });
    }
}


export async function deleteVehicle(req: Request, res: Response) {
    const { carNumber } = req.params;
    try {
        const vehicle = await findVehicleByCarNumber(carNumber);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // בדיקת תקינות Customer_Id
        if (!vehicle.Customer_Id) {
            return res.status(400).json({ message: 'Customer ID is missing for this vehicle' });
        }

        const result = await removeVehicle(carNumber);
        if (result.deletedCount > 0) {
            await removeVehicleFromCustomerArray(new ObjectId(vehicle.Customer_Id), vehicle._id as ObjectId);  // הוספנו המרה בטוחה ל-ObjectId
            res.status(200).json({ message: 'Vehicle deleted successfully' });
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ error });
    }
}


export async function getVehicleByCarNumber(req: Request, res: Response) {
    const { carNumber } = req.params;
    try {
        const vehicle = await findVehicleByCarNumber(carNumber);
        if (vehicle) {
            res.status(200).json({ vehicle });
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}