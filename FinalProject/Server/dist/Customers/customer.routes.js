"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("./customer.controller");
const CustomerRouter = (0, express_1.Router)();
CustomerRouter.get('/', customer_controller_1.getAllCustomers);
CustomerRouter.get('/email/:email', customer_controller_1.getCustomerByEmail);
CustomerRouter.get('/:customerId', customer_controller_1.getCustomerById);
CustomerRouter.post('/', customer_controller_1.addCustomer);
CustomerRouter.put('/:customerId', customer_controller_1.updateCustomer);
CustomerRouter.delete('/:customerId', customer_controller_1.deleteCustomer);
CustomerRouter.post('/login', customer_controller_1.loginCustomer);
CustomerRouter.get('/auth/google', customer_controller_1.loginWithGoogle);
CustomerRouter.get('/auth/google/callback', customer_controller_1.loginWithGoogleCallback);
exports.default = CustomerRouter;
//# sourceMappingURL=customer.routes.js.map