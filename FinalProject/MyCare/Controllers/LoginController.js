import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (email, password) => {
    try {
        // שליחת בקשת התחברות ישירה עם המייל והסיסמה
        const loginBody = JSON.stringify({
            email: email.trim(),
            password: password.trim(),
        });

        const loginResponse = await fetch('https://my-care-server.onrender.com/api/customer/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: loginBody,
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();  // קריאה ישירה ל-json

            await AsyncStorage.setItem('userToken', loginData.customer._id.toString());
            return loginData.customer;
        } else {
            const loginResponseBody = await loginResponse.text();  // קריאת טקסט רק במידה ויש שגיאה
            console.error('Login failed:', loginResponse.status, loginResponseBody);
            return null;
        }
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export default {
    login,
};