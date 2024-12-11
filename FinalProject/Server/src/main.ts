import 'dotenv/config'; // apply env vars
import express from 'express';
import VehicleRouter from './vehicle/vehicle.routes';
import CustomerRouter from './Customers/customer.routes';


//config
//process.env.PORT --> the live server port
const PORT = process.env.PORT || 9877; 

//create the server
const server = express();

// הגדרת מגבלה על גודל הבקשה
server.use(express.json({ limit: '10mb' })); // הגבל את הבקשות בפורמט JSON לגודל של 10MB
server.use(express.urlencoded({ limit: '10mb', extended: true })); // הגבל את הבקשות בפורמט URL-encoded לגודל של 10MB

//config JSON support     
server.use(express.json());

//using routes
server.use('/api/vehicle', VehicleRouter);
server.use('/api/customer', CustomerRouter);

//run the server
server.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));