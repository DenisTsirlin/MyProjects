import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerUser, checkEmailExists } from '../Controllers/RegisterController';

export default function Register({ navigation }) {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDay: '',
        drivingLicense: ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [loading, setLoading] = useState(false);

    const nameRegex = /^[a-zA-Z\u0590-\u05FF]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co\.il|ac\.il|net|org)$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]{8,12}$/;
    const dateRegex = /^\d{2}([./-])\d{2}\1\d{4}$/;

    const onChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDateOfBirth(selectedDate);
            setUserDetails({ ...userDetails, birthDay: selectedDate });
        }
    };

    const showDatepicker = () => {
        if (Platform.OS === 'android') {
            setShowDatePicker(true);
        }
    };

    const handleRegister = async () => {
        if (!nameRegex.test(userDetails.firstName)) {
            Alert.alert('שגיאה', 'שם פרטי חייב להכיל רק אותיות');
            return;
        }

        if (!nameRegex.test(userDetails.lastName)) {
            Alert.alert('שגיאה', 'שם משפחה חייב להכיל רק אותיות');
            return;
        }

        if (!emailRegex.test(userDetails.email)) {
            Alert.alert('שגיאה', 'כתובת אימייל אינה תקינה');
            return;
        }

        if (!passwordRegex.test(userDetails.password)) {
            Alert.alert('שגיאה', 'הסיסמה חייבת להכיל בין 8-12 תווים, לפחות אות גדולה אחת, ספרה אחת ותו מיוחד (@, !) ');
            return;
        }

        if (Platform.OS === 'ios' && userDetails.birthDay && !dateRegex.test(userDetails.birthDay)) {
            Alert.alert('שגיאה', 'תאריך לידה חייב להיות בפורמט dd/mm/yyyy');
            return;
        }

        // המרת התאריך לפורמט תקני במידת הצורך
        let birthDate = dateOfBirth;
        if (Platform.OS === 'ios' && userDetails.birthDay) {
            const [day, month, year] = userDetails.birthDay.split(/[./-]/);
            birthDate = new Date(`${year}-${month}-${day}`);
        }

        const formattedUserDetails = {
            First_Name: userDetails.firstName,
            Last_Name: userDetails.lastName,
            Email: userDetails.email.toLowerCase(),
            Password: userDetails.password,
            Birth_Day: birthDate ? birthDate.toISOString().split('T')[0] : '',
            Driving_License: userDetails.drivingLicense
        };

        setLoading(true);
        const emailExists = await checkEmailExists(userDetails.email.toLowerCase());
        setLoading(false);

        if (emailExists) {
            Alert.alert('שגיאה', 'המייל הזה כבר קיים במערכת');
            return;
        }

        const result = await registerUser(formattedUserDetails);
        setLoading(false);

        if (result.success) {
            Alert.alert('הרשמה מוצלחת', 'נרשמת בהצלחה');
            navigation.navigate('Login');
        } else {
            Alert.alert('הרשמה נכשלה', result.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Image
                        source={require('../assets/Reload_Page.gif')}
                        style={styles.gifStyle}
                    />
                    <ActivityIndicator size="large" color="#AD40AF" />
                    <Text style={styles.loadingText}>טוען...</Text>
                </View>
            ) : (
                <ScrollView>
                    <View style={{ paddingHorizontal: 25 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../assets/Images/logo.png')} style={{ width: 300, height: 250, transform: [{ rotate: '0deg' }] }} />
                        </View>
                        <View>
                            <Text style={styles.titleLogin}>הרשמה</Text>
                        </View>

                        <View style={styles.inputField}>
                            <MaterialIcons name='person-outline' size={20} color='#666' style={{ marginRight: 5 }} />
                            <TextInput
                                placeholder='שם פרטי'
                                style={styles.textInput}
                                value={userDetails.firstName}
                                onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
                            />
                        </View>

                        <View style={styles.inputField}>
                            <MaterialIcons name='person-outline' size={20} color='#666' style={{ marginRight: 5 }} />
                            <TextInput
                                placeholder='שם משפחה'
                                style={styles.textInput}
                                value={userDetails.lastName}
                                onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
                            />
                        </View>

                        <View style={styles.inputField}>
                            <MaterialIcons name='alternate-email' size={20} color='#666' style={{ marginRight: 5 }} />
                            <TextInput
                                placeholder='דוא"ל'
                                style={styles.textInput}
                                keyboardType='email-address'
                                value={userDetails.email}
                                onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                            />
                        </View>

                        <View style={styles.inputField}>
                            <Ionicons name='lock-closed-outline' size={24} color='#666' style={{ marginRight: 5 }} />
                            <TextInput
                                placeholder='סיסמה'
                                style={styles.textInput}
                                secureTextEntry={true}
                                value={userDetails.password}
                                onChangeText={(text) => setUserDetails({ ...userDetails, password: text })}
                            />
                        </View>

                        <View style={styles.inputField}>
                            <MaterialIcons name='calendar-today' size={20} color='#666' style={{ marginRight: 5 }} />
                            {Platform.OS === 'android' ? (
                                <TouchableOpacity onPress={showDatepicker} style={{ flex: 1 }}>
                                    {dateOfBirth ? (
                                        <Text style={[styles.textInput, { textAlign: 'right', textAlignVertical: 'center', writingDirection: 'rtl' }]}>
                                            {dateOfBirth.toLocaleDateString()}
                                        </Text>
                                    ) : (
                                        <TextInput
                                            placeholder='תאריך לידה'
                                            style={[styles.textInput, { textAlign: 'right', textAlignVertical: 'center', writingDirection: 'rtl' }]}
                                            editable={false}
                                        />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TextInput
                                    placeholder='תאריך לידה (לדוגמה: 01.01.2000)'
                                    style={[styles.textInput, { textAlign: 'right', textAlignVertical: 'center', writingDirection: 'rtl' }]}
                                    value={userDetails.birthDay}
                                    onChangeText={(text) => setUserDetails({ ...userDetails, birthDay: text })}
                                />
                            )}
                        </View>

                        {Platform.OS === 'android' && showDatePicker && (
                            <DateTimePicker
                                value={dateOfBirth || new Date()}
                                mode="date"
                                display="default"
                                onChange={onChange}
                                maximumDate={new Date()}
                            />
                        )}

                        <View style={styles.inputField}>
                            <MaterialIcons name='drive-eta' size={20} color='#666' style={{ marginRight: 5 }} />
                            <TextInput
                                placeholder="מספר רישיון נהיגה"
                                style={styles.textInput}
                                value={userDetails.drivingLicense}
                                onChangeText={(text) => setUserDetails({ ...userDetails, drivingLicense: text })}
                            />
                        </View>

                        <TouchableOpacity onPress={handleRegister} style={styles.buttonLogin}>
                            <Text style={styles.textLogin}>הרשמה</Text>
                        </TouchableOpacity>

                        <View style={styles.loginLinkContainer}>
                            <Text>כבר רשומים? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>התחברות</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleLogin: {
        fontSize: 35,
        fontWeight: '500',
        color: '#333',
        marginBottom: 30,
        marginRight: 230,
    },
    inputField: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    buttonLogin: {
        backgroundColor: '#AD40AF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    textLogin: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        marginLeft: 8,
        color: '#AD40AF',
    },
    gifStyle: {
        width: 300,
        height: 300,
        marginLeft: 0,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginLink: {
        color: '#AD40AF',
        fontWeight: 'bold',
    },
});
