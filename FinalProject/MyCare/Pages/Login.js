import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image, I18nManager, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import loginController from '../Controllers/LoginController';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// הפעלת מצב RTL
I18nManager.forceRTL(true);

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  // מצב לטעינה

    const handleLogin = async () => {
        console.log('ניסיון כניסה עם:', email, password);
        setLoading(true);  // הצגת דף טעינה
        try {
            await AsyncStorage.removeItem('userToken');

            const customer = await loginController.login(email.toLowerCase(), password); // המרת המייל לאותיות קטנות
            if (customer) {
                // שמירת כל אובייקט הלקוח כולל הרכבים שלו
                await AsyncStorage.setItem('user', JSON.stringify(customer));

                // נווט למסך הראשי
                navigation.navigate('MainTabs');
            } else {
                Alert.alert('הכניסה נכשלה', 'כתובת המייל או הסיסמה שגויים');
            }
        } catch (error) {
            console.error('שגיאת כניסה:', error.message);
            Alert.alert('שגיאה', `משהו השתבש. נסה שוב מאוחר יותר. שגיאה: ${error.message}`);
        } finally {
            setLoading(false);  // סיום הטעינה
        }
    };

    const handleGoogleLogin = async () => {
        const googleLoginUrl = 'https://my-care-server.onrender.com/api/customer/auth/google';
        let result = await WebBrowser.openBrowserAsync(googleLoginUrl);
        console.log(result);
    };

    // ניקוי השדות בעת מעבר לדף
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? (
                // דף טעינה
                <View style={styles.loadingContainer}>
                    <Image 
                        source={require('../assets/Reload_Page.gif')} 
                        style={styles.gifStyle} 
                    />
                    <ActivityIndicator size="large" color="#AD40AF" />
                    <Text style={styles.loadingText}>טוען...</Text>
                </View>
            ) : (
                // מסך התחברות
                <View style={{ paddingHorizontal: 25 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../assets/Images/logo.png')} style={{ width: 300, height: 250, transform: [{ rotate: '0deg' }] }} />
                    </View>
                    <Text style={styles.titleLogin}>התחברות</Text>

                    <View style={styles.inputEmail}>
                        <MaterialIcons name='alternate-email' size={20} color='#666' style={{ marginRight: 5 }} />
                        <TextInput
                            placeholder='מייל'
                            style={{ flex: 1, paddingVertical: 0, textAlign: 'right' }}
                            keyboardType='email-address'
                            value={email}
                            onChangeText={(txt) => setEmail(txt)} // המרת המייל לאותיות קטנות
                        />
                    </View>

                    <View style={styles.inputEmail}>
                        <Ionicons name='lock-closed-outline' size={24} color='#666' style={{ marginRight: 5 }} />
                        <TextInput
                            placeholder='סיסמא'
                            style={{ flex: 1, paddingVertical: 0, textAlign: 'right' }}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(txt) => setPassword(txt)}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                        <Text style={{ color: '#666', fontSize: 14 }}>שכחת סיסמא? </Text>
                        <TouchableOpacity onPress={() => Alert.alert("הנחיות לשחזור סיסמא")}>
                            <Text style={{ color: '#AD40AF', fontSize: 14 }}> לחץ כאן</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
                        <Text style={styles.textLogin}>התחברות</Text>
                    </TouchableOpacity>

                    <Text style={{ textAlign: 'center', color: '#666', marginBottom: 14 }}>התחבר באמצעות אחד מהפרופילים החברתיים שלך</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                        <TouchableOpacity onPress={handleGoogleLogin}>
                            <View style={{ borderColor: '#ddd', borderRadius: 10, borderWidth: 2, paddingHorizontal: 30, paddingVertical: 10 }}>
                                <Image source={require('../assets/Images/google.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={{ borderColor: '#ddd', borderRadius: 10, borderWidth: 2, paddingHorizontal: 30, paddingVertical: 10 }}>
                                <Image source={require('../assets/Images/facebook.png')} style={{ width: 34, height: 34 }} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={{ borderColor: '#ddd', borderRadius: 10, borderWidth: 2, paddingHorizontal: 30, paddingVertical: 10 }}>
                                <Image source={require('../assets/Images/twitter.png')} style={{ width: 34, height: 34 }} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
                        <Text>חדש באפליקציה?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: '#AD40AF', fontWeight: '700' }}> הרשמה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleLogin: {
        fontSize: 28,
        fontWeight: '500',
        color: '#333',
        marginBottom: 30,
        textAlign: 'right',
        marginRight: 228,
    },
    inputEmail: {
        flexDirection: 'row-reverse',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
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
        marginLeft:13,
        color: '#AD40AF',
    },
    gifStyle: {
        width: 300,  
        height: 300,
        marginLeft:0,
    },
});
