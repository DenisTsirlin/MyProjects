"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithGoogle = loginWithGoogle;
exports.loginWithGoogleCallback = loginWithGoogleCallback;
exports.getAllCustomers = getAllCustomers;
exports.getCustomerByEmail = getCustomerByEmail;
exports.addCustomer = addCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
exports.loginCustomer = loginCustomer;
exports.getCustomerById = getCustomerById;
const customer_model_1 = require("./customer.model");
const crypto_1 = __importDefault(require("crypto"));
const mongodb_1 = require("mongodb");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:9877/api/customer/auth/google/callback';
function loginWithGoogle(req, res) {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
}
async function loginWithGoogleCallback(req, res) {
    let { code } = req.query;
    try {
        let response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI
            })
        });
        let data = await response.json();
        const { access_token } = data;
        response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        data = await response.json();
        const customer = await (0, customer_model_1.findOrCreateCustomerWithGoogle)(data);
        res.status(200).json({ customer });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
async function getAllCustomers(req, res) {
    try {
        const customers = await (0, customer_model_1.getAll)();
        res.status(200).json({ customers });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
async function getCustomerByEmail(req, res) {
    const { email } = req.params;
    try {
        const customer = await (0, customer_model_1.getByEmail)(email);
        if (customer) {
            res.status(200).json({ customer });
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
async function addCustomer(req, res) {
    const newCustomer = req.body;
    try {
        // יצירת Salt
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        // הצפנה עם SHA-256 תוך שימוש ב-Salt
        const hash = crypto_1.default.createHash('sha256').update(newCustomer.Password + salt).digest('hex');
        // שמירת הסיסמה המוצפנת וה-Salt במסד הנתונים
        newCustomer.Password = hash;
        newCustomer.Salt = salt; // ודא שה-Salt נשמר במסד הנתונים
        const result = await (0, customer_model_1.addNewCustomer)(newCustomer);
        // לוגים לאישור שה-Salt נשמר
        console.log('Customer Saved:', newCustomer);
        res.status(201).json({ message: 'Customer added successfully', result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
async function updateCustomer(req, res) {
    console.log("Received update data:", req.body);
    const { customerId } = req.params;
    const updates = req.body;
    const allowedUpdates = ['First_Name', 'Last_Name', 'Email', 'Password', 'Birth_Day', 'Driving_License'];
    const keys = Object.keys(updates);
    const isValidUpdate = keys.every(key => allowedUpdates.includes(key));
    if (!isValidUpdate) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }
    try {
        if (updates.Password) {
            const salt = crypto_1.default.randomBytes(16).toString('hex');
            const hashedPassword = crypto_1.default.createHash('sha256').update(updates.Password + salt).digest('hex');
            updates.Password = hashedPassword;
            updates.Salt = salt;
            console.log("Password encrypted:", updates.Password);
        }
        // הוספת לוג כדי לוודא את הנתונים הנשלחים לעדכון
        console.log("Updating customer with ID:", customerId);
        console.log("Update data after processing:", updates);
        const result = await (0, customer_model_1.updateCustomerDetails)(new mongodb_1.ObjectId(customerId), updates);
        console.log("Update result:", result); // הצגת תוצאת העדכון
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Customer updated successfully', result });
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        console.error("Error in updateCustomer:", error); // הדפסת שגיאה מפורטת
        res.status(500).json({ error });
    }
}
async function deleteCustomer(req, res) {
    const { customerId } = req.params;
    try {
        // מחיקת כל הרכבים של הלקוח
        await (0, customer_model_1.deleteVehiclesByCustomerId)(new mongodb_1.ObjectId(customerId));
        // מחיקת הלקוח עצמו
        const result = await (0, customer_model_1.removeCustomer)(new mongodb_1.ObjectId(customerId));
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Customer and their vehicles deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
async function loginCustomer(req, res) {
    const { email, password } = req.body;
    try {
        // חיפוש המשתמש לפי אימייל
        const customer = await (0, customer_model_1.getByEmail)(email);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // הצפנה של הסיסמה שהמשתמש הכניס עם ה-Salt
        const hashedPassword = crypto_1.default.createHash('sha256').update(password + customer.Salt).digest('hex');
        // השוואת הסיסמה המוצפנת עם זו השמורה במסד הנתונים
        if (customer.Password === hashedPassword) {
            return res.status(200).json({ message: 'Login successful', customer });
        }
        else {
            return res.status(401).json({ message: 'Invalid password' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}
async function getCustomerById(req, res) {
    const { customerId } = req.params;
    try {
        const customer = await (0, customer_model_1.getCustomerByIdWithVehicles)(customerId);
        if (customer) {
            res.status(200).json({ customer });
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
//# sourceMappingURL=customer.controller.js.map