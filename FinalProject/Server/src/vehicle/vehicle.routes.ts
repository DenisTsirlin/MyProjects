import { Router } from "express";
import { addVehicle, deleteVehicle, getAllVehicles, getVehicleByCarNumber, getVehiclesByCustomerId, updateVehicle } from "./vehicle.controller";

const VehicleRouter = Router();

VehicleRouter.get('/', getAllVehicles);
VehicleRouter.get('/customer/:customerId', getVehiclesByCustomerId);
VehicleRouter.get('/number/:carNumber', getVehicleByCarNumber);
VehicleRouter.post('/', addVehicle); 
VehicleRouter.put('/:carNumber', updateVehicle); 
VehicleRouter.delete('/:carNumber', deleteVehicle); 

export default VehicleRouter;
