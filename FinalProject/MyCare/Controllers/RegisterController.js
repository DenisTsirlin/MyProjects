// ודא שיש ייצוא לפונקציה
export const registerUser = async (userDetails) => {
    try {
        const response = await fetch(`https://my-care-server.onrender.com/api/customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('משתמש נרשם בהצלחה:', result);
            return { success: true, data: result };
        } else {
            console.error('נכשל לרשום משתמש', response.status, response.statusText);
            return { success: false, message: 'הרישום נכשל, נסה שוב' };
        }
    } catch (error) {
        console.error('שגיאה ברישום המשתמש:', error);
        return { success: false, message: `שגיאה: ${error.message}` };
    }
};


export const checkEmailExists = async (email) => {
    try {
        const response = await fetch(`https://my-care-server.onrender.com/api/customer/email/${email}`);
        if (response.status === 200) {
            const result = await response.json();
            return result.customer ? true : false; // אם יש לקוח עם המייל הזה במערכת
        }
        return false;
    } catch (error) {
        console.error('שגיאה בבדיקת המייל:', error);
        return false;
    }
};
