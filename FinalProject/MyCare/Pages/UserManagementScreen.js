import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserDetails } from '../Controllers/UpdateUserController';
import { deleteCustomer } from '../Controllers/DeleteCustomerController'; // Import delete controller

const UserManagementScreen = () => {
    const [userDetails, setUserDetails] = useState({
        customerId: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        birthDay: '',
        drivingLicense: '',
    });
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const nameRegex = /^[a-zA-Z\u0590-\u05FF]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co\.il|ac\.il|net|org)$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]{8,12}$/;

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUserDetails({
                        customerId: parsedUserData._id || '',
                        password: parsedUserData.Password || '',
                        email: parsedUserData.Email || '',
                        firstName: parsedUserData.First_Name || '',
                        lastName: parsedUserData.Last_Name || '',
                        birthDay: parsedUserData.Birth_Day || '',
                        drivingLicense: parsedUserData.Driving_License || '',
                    });
                }
            } catch (error) {
                console.error("Failed to load user data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const handleSave = async () => {
        if (!nameRegex.test(userDetails.firstName) || !nameRegex.test(userDetails.lastName)) {
            Alert.alert("Error", "שם פרטי ושם משפחה צריכים להכיל רק אותיות באנגלית או בעברית");
            return;
        }
        if (!emailRegex.test(userDetails.email)) {
            Alert.alert("Error", "האימייל לא תקין");
            return;
        }
    
        if (isEditingPassword && !passwordRegex.test(userDetails.password)) {
            Alert.alert("Error", "הסיסמה חייבת להיות באורך 8-12 תווים, עם לפחות אות גדולה אחת, ספרה אחת ותו מיוחד אחד");
            return;
        }
    
        Alert.alert(
            "אישור שמירה",
            "האם אתה בטוח שברצונך לשמור את השינויים?",
            [
                { text: "ביטול", style: "cancel" },
                {
                    text: "שמור",
                    onPress: async () => {
                        const updates = {
                            customerId: userDetails.customerId,
                            email: userDetails.email,
                            firstName: userDetails.firstName,
                            lastName: userDetails.lastName,
                            birthDay: userDetails.birthDay,
                            drivingLicense: userDetails.drivingLicense,
                        };
    
                        if (isEditingPassword) {
                            updates.password = userDetails.password;
                        }
    
                        setLoading(true);
                        const success = await updateUserDetails(updates);
                        setLoading(false);
    
                        if (success) {
                            await AsyncStorage.setItem(
                                'user',
                                JSON.stringify({
                                    ...userDetails,
                                    First_Name: userDetails.firstName,
                                    Last_Name: userDetails.lastName,
                                })
                            );
    
                            Alert.alert("הצלחה", "הנתונים עודכנו בהצלחה!", [
                                {
                                    text: "אישור",
                                    onPress: () => {
                                        navigation.navigate('MainTabs', { screen: 'דף הבית' });
                                    }
                                }
                            ]);
                        } else {
                            Alert.alert("Error", "Failed to update user details");
                        }
                    },
                    style: "default"
                }
            ]
        );
    };

    const handleDelete = async () => {
        Alert.alert(
            "מחק משתמש",
            "האם אתה בטוח שברצונך למחוק את המשתמש?",
            [
                { text: "ביטול", style: "cancel" },
                {
                    text: "מחק",
                    onPress: async () => {
                        setLoading(true);
                        const response = await deleteCustomer(userDetails.customerId);
                        setLoading(false);
                        if (response && response.message === 'Customer and their vehicles deleted successfully') {
                            await AsyncStorage.removeItem('user');
                            Alert.alert("הצלחה", "המשתמש נמחק בהצלחה", [
                                { text: "אישור", onPress: () => navigation.navigate('Login') }
                            ]);
                        } else {
                            Alert.alert("Error", "Failed to delete the customer.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Image 
                        source={require('../assets/Reload_Page.gif')} 
                        style={styles.gifStyle} 
                    />
                    <ActivityIndicator size="large" color="#AD40AF" />
                    <Text style={styles.loadingText}>נטען...</Text>
                </View>
            ) : (
                <ScrollView>
                    <View style={styles.container}>
                         
                        <Text style={styles.label}>סיסמא:</Text>
                        <TextInput
                            style={styles.input}
                            value={isEditingPassword ? userDetails.password : '*'.repeat(4)}
                            onFocus={() => setIsEditingPassword(true)}
                            onChangeText={(text) => setUserDetails({ ...userDetails, password: text })}
                            placeholder="הזן סיסמה חדשה"
                            secureTextEntry={isEditingPassword}
                        />
                        <Text style={styles.label}>מייל:</Text>
                        <TextInput
                            style={styles.input}
                            value={userDetails.email}
                            onChangeText={(text) => {
                                if (emailRegex.test(text) || text === '') {
                                    setUserDetails({ ...userDetails, email: text });
                                }
                            }}
                        />
                        <Text style={styles.label}>שם פרטי:</Text>
                        <TextInput
                            style={styles.input}
                            value={userDetails.firstName}
                            onChangeText={(text) => {
                                if (nameRegex.test(text) || text === '') {
                                    setUserDetails({ ...userDetails, firstName: text });
                                }
                            }}
                        />
                        <Text style={styles.label}>שם משפחה:</Text>
                        <TextInput
                            style={styles.input}
                            value={userDetails.lastName}
                            onChangeText={(text) => {
                                if (nameRegex.test(text) || text === '') {
                                    setUserDetails({ ...userDetails, lastName: text });
                                }
                            }}
                        />
                        <Text style={styles.label}>תאריך יומולדת:</Text>
                        <TextInput
                            style={styles.input}
                            value={userDetails.birthDay}
                            onChangeText={(text) => setUserDetails({ ...userDetails, birthDay: text })}
                        />
                        <Text style={styles.label}>מספר רישיון רכב:</Text>
                        <TextInput
                            style={styles.input}
                            value={userDetails.drivingLicense}
                            onChangeText={(text) => setUserDetails({ ...userDetails, drivingLicense: text })}
                        />

                        {/* Save Button with increased text size */}  
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>שמור</Text>
                        </TouchableOpacity>

                        {/* Delete User Button */}
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.deleteButtonText}>מחק משתמש</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', 
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#AD40AF',
    },
    gifStyle: {
        width: 300,  
        height: 300,
    },
    saveButton: {
        backgroundColor: '#4CAF50',  // צבע ירוק עבור שמירה
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,  // אותו גודל טקסט כמו כפתור המחיקה
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserManagementScreen;