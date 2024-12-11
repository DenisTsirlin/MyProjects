import { ObjectId } from "mongodb";

export type Customer = {
    _id?: ObjectId;
    First_Name: string;
    Last_Name: string;
    Email: string;
    Password: string;
    Birth_Day: Date | undefined;
    Driving_License: number | undefined;
    Vehicles?: ObjectId[];
    Salt?: string; 
    
};
