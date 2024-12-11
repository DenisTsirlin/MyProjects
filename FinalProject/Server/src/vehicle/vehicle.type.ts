import { ObjectId } from "mongodb"

export type Vehicle = {
    _id?: ObjectId
    Car_Number: string
    Color?: string
    Customer_Id?: string
    Insurance_Expiration?: Date | undefined
    Manufacturer?: string
    Model?: string
    Number_Of_Kilometers:number
    Year_of_Manufacture?:string
    imageURL?: string;
    insuranceUrl?: string;
}