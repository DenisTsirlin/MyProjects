import { Router } from 'express';
import { addCustomer, deleteCustomer, getAllCustomers, updateCustomer, loginWithGoogle, loginWithGoogleCallback, getCustomerByEmail, loginCustomer, getCustomerById } from './customer.controller';

const CustomerRouter = Router();

CustomerRouter.get('/', getAllCustomers);
CustomerRouter.get('/email/:email', getCustomerByEmail);
CustomerRouter.get('/:customerId', getCustomerById);
CustomerRouter.post('/', addCustomer);
CustomerRouter.put('/:customerId', updateCustomer);
CustomerRouter.delete('/:customerId', deleteCustomer);
CustomerRouter.post('/login', loginCustomer);
CustomerRouter.get('/auth/google', loginWithGoogle);
CustomerRouter.get('/auth/google/callback', loginWithGoogleCallback);

export default CustomerRouter;
