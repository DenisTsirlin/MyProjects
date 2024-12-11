import { Alert } from 'react-native';

export const updateUserDetails = async (userDetails) => {
    try {
        const response = await fetch(`https://my-care-server.onrender.com/api/customer/${userDetails.customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Password: userDetails.password,
                Email: userDetails.email,
                First_Name: userDetails.firstName,
                Last_Name: userDetails.lastName,
                Birth_Day: userDetails.birthDay,
                Driving_License: userDetails.drivingLicense,
            }),
        });

        if (response.ok) {
            console.log("User details updated successfully");
            return true;
        } else {
            const errorData = await response.json();
            console.error("Failed to update user details:", errorData);
            Alert.alert('Error', `Failed to update user details: ${errorData.message}`);
            return false;
        }
    } catch (error) {
        console.error("Error updating user details:", error);
        Alert.alert('Error', 'An unexpected error occurred');
        return false;
    }
};

