"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // apply env vars
const express_1 = __importDefault(require("express"));
const vehicle_routes_1 = __importDefault(require("./vehicle/vehicle.routes"));
const customer_routes_1 = __importDefault(require("./Customers/customer.routes"));
//config
//process.env.PORT --> the live server port
const PORT = process.env.PORT || 9877;
//create the server
const server = (0, express_1.default)();
// הגדרת מגבלה על גודל הבקשה
server.use(express_1.default.json({ limit: '10mb' })); // הגבל את הבקשות בפורמט JSON לגודל של 10MB
server.use(express_1.default.urlencoded({ limit: '10mb', extended: true })); // הגבל את הבקשות בפורמט URL-encoded לגודל של 10MB
//config JSON support     
server.use(express_1.default.json());
//using routes
server.use('/api/vehicle', vehicle_routes_1.default);
server.use('/api/customer', customer_routes_1.default);
//run the server
server.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));
//# sourceMappingURL=main.js.map