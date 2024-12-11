
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { deleteVehicleByCarNumber } from '../Controllers/DeleteVehicleController';
import { updateVehicleDetails } from '../Controllers/UpdateVehicleController';
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';

const HomePage = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingCarId, setDeletingCarId] = useState(null);
    const [editingCarId, setEditingCarId] = useState(null);
    const [editedVehicleDetails, setEditedVehicleDetails] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (userData) {
                        const parsedUser = JSON.parse(userData);
                        setUser(parsedUser);
                        if (parsedUser._id) {
                            const cars = await fetchCarDetails(parsedUser._id);
                            setCars(cars);
                        }
                    } else {
                        console.log('No user data found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }, [])
    );
    const fetchCarDetails = async (customerId) => {
        setLoading(true);
        try {
            const response = await fetch(`https://my-care-server.onrender.com/api/vehicle/customer/${customerId}`);
            const carData = await response.json();
            if (carData && carData.vehicles) {
                return carData.vehicles;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching car details:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);

                    if (parsedUser._id) {
                        const cars = await fetchCarDetails(parsedUser._id);
                        setCars(cars);
                    }
                } else {
                    console.log('No user data found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchUser();
        });

        return unsubscribe;
    }, [navigation]);

    const handleDeleteCar = async (carNumber) => {
        Alert.alert(
            'אישור מחיקה',
            'האם את/ה בטוח/ה שאת/ה רוצה למחוק את הרכב?',
            [
                {
                    text: 'לא',
                    style: 'cancel',
                },
                {
                    text: 'כן',
                    onPress: async () => {
                        setLoading(true);
                        setDeletingCarId(carNumber);
                        try {
                            const result = await deleteVehicleByCarNumber(carNumber);
                            if (result.message === 'Vehicle deleted successfully') {
                                const updatedCars = cars.filter(car => car.Car_Number !== carNumber);
                                setCars(updatedCars);
                            } else {
                                Alert.alert('שגיאה', 'לא הצלחנו למחוק את הרכב');
                            }
                        } catch (error) {
                            Alert.alert('שגיאה', 'שגיאה במחיקת הרכב');
                        } finally {
                            setLoading(false);
                            setDeletingCarId(null);
                        }
                    },
                },
            ]
        );
    };

    const toggleEdit = (car) => {
        if (editingCarId === car.Car_Number) {
            setEditingCarId(null);
            setEditedVehicleDetails({});
        } else {
            setEditingCarId(car.Car_Number);
            setEditedVehicleDetails({ 
                ...car, 
                Year_of_Manufacture: car.Year_of_Manufacture ? String(car.Year_of_Manufacture) : "" // המרת השדה למחרוזת
            });
        }
    };
    
    const handleInputChange = (field, value) => {
        setEditedVehicleDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);

        // סינון שדות לפי השדות המותרים לעדכון
        const allowedUpdates = (({ Manufacturer, Year_of_Manufacture, Color, Number_Of_Kilometers, Insurance_Expiration, Model }) =>
            ({ Manufacturer, Year_of_Manufacture, Color, Number_Of_Kilometers, Insurance_Expiration, Model }))(editedVehicleDetails);

        try {
            const success = await updateVehicleDetails(editingCarId, allowedUpdates);

            if (success) {
                const updatedCars = cars.map(car => car.Car_Number === editingCarId ? editedVehicleDetails : car);
                setCars(updatedCars);
                setEditingCarId(null);
                Alert.alert("הרכב עודכן בהצלחה");
            } else {
                Alert.alert("שגיאה בעדכון הרכב");
            }
        } catch (error) {
            console.error("שגיאה בעדכון הרכב:", error);
            Alert.alert("שגיאה בעדכון הרכב:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderCarItem = ({ item }) => (
        <View style={styles.carContainer}>
            <Text style={styles.carTitle}>הרכב שלך</Text>

            {/* הצגת התמונה אם היא קיימת */}
            {item.imageURL ? (
                <Image source={{ uri: item.imageURL }} style={styles.carImage} />
            ) : (
                <Text>אין תמונה זמינה</Text> // במקרה שאין תמונה לרכב
            )}

            {editingCarId === item.Car_Number ? (
                <>
                    <Text>מספר רכב:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Car_Number}
                        editable={false}
                    />
                    <Text>יצרן:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Manufacturer}
                        editable={false}
                    />
                    <Text>שנת ייצור:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Year_of_Manufacture}
                        editable={false}
                    />
                    <Text>צבע:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Color}
                        editable={false}
                    />
                    <Text>קילומטרים:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Number_Of_Kilometers}
                        onChangeText={(text) => handleInputChange('Number_Of_Kilometers', text)}
                        editable={true} // Only mileage is editable
                    />
                    <Text>תוקף ביטוח:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Insurance_Expiration}
                        editable={false}
                    />
                    <Text>מודל:</Text>
                    <TextInput
                        style={styles.input}
                        value={editedVehicleDetails.Model}
                        editable={false}
                    />
                    <View style={styles.editActions}>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.buttonText}>שמור</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleEdit(item)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>ביטול</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text>מספר רכב: {item.Car_Number}</Text>
                    <Text>יצרן: {item.Manufacturer}</Text>
                    <Text>שנת ייצור: {item.Year_of_Manufacture}</Text>
                    <Text>צבע: {item.Color}</Text>
                    <Text>קילומטרים: {item.Number_Of_Kilometers}</Text>
                    <Text>תוקף ביטוח: {item.Insurance_Expiration}</Text>
                    <Text>מודל: {item.Model}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.editButton, { width: wp('33%') }]}
                            onPress={() => toggleEdit(item)}>
                            <Text style={styles.editButtonText}> עדכון קילומטראז'</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deleteButton,{width: wp('25%')}]}
                            onPress={() => handleDeleteCar(item.Car_Number)}
                            disabled={loading && deletingCarId === item.Car_Number}
                        >
                            {loading && deletingCarId === item.Car_Number ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.deleteButtonText}>מחק רכב</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );

    const handleLogout = () => {
        console.log("Attempting logout..."); 
        Alert.alert(
            'אישור התנתקות',
            'האם את/ה בטוח/ה שאת/ה רוצה להתנתק?',
            [
                {
                    text: 'לא',
                    style: 'cancel',
                },
                {
                    text: 'כן',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            await AsyncStorage.removeItem('user');
                            console.log("User data removed from AsyncStorage"); // וידוא שנמחק מהזיכרון

                            // הוספת שינה כדי לוודא שהזיכרון מתנקה לפני המעבר
                            setTimeout(() => {
                                navigation.navigate('Login');
                                console.log("Navigating to Login screen"); // בדוק שהניווט מתבצע
                            }, 500);

                        } catch (error) {
                            console.error("Logout error on iOS:", error);
                            Alert.alert("שגיאה", "שגיאה בעת ההתנתקות, נסה שוב.");
                        }
                    },
                },
            ]
        );
    };

    const LogoutButton = ({ onPress }) => {
        return (
            <View style={styles.logoutButtonContainer}>
                {Platform.OS === 'ios' ? (
                    <Button title="התנתקות" onPress={onPress} color="#AD40AF" />
                ) : (
                    <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
                        <Text style={styles.buttonText}>התנתקות</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <LogoutButton onPress={handleLogout} />

                <View style={styles.logoContainer}>
                    <Image source={require('../assets/Images/logo.png')} style={styles.logo} />
                </View>

                <Text style={styles.welcomeText}>
                    שלום {user ? (
                        <>
                            <Text style={styles.userName}>{user.First_Name || ''} </Text>
                            <Text style={styles.userName}>{user.Last_Name || ''}</Text>
                        </>
                    ) : 'התחברת/הירשם'}, ברוכ/ה הבא/ה !
                </Text>

                <View style={styles.content}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#AD40AF" />
                            <Text style={styles.loadingText}>טוען רכבים...</Text>
                        </View>
                    ) : cars.length > 0 ? (
                        <FlatList
                            data={cars}
                            renderItem={renderCarItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={wp('85%')}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingLeft: wp('3%') }}
                            ItemSeparatorComponent={() => <View style={{ width: wp('10%') }} />}
                        />
                    ) : (
                        <View style={styles.emptyCarContainer}>
                            <Text style={styles.missingCarText}>חסר רכב ברשימה</Text>
                        </View>
                    )}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.menu}>
                <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.greenButton]}
                            onPress={() => {
                                if (cars.length > 0 && cars[0].Manufacturer) {
                                    // אם יש רכב עם יצרן, מעביר את היצרן לדף המוסכים
                                    navigation.navigate('NearbyGarages', { manufacturer: cars[0].Manufacturer });
                                } else {
                                    // אם אין רכב ברשימה, פשוט מעביר לדף המוסכים ללא פרמטר
                                    navigation.navigate('NearbyGarages');
                                }
                            }}
                        >
                            <Icon name="help-outline" size={24} color="white" />
                            <Text style={styles.buttonText}>מוסכים בקרבת מקום</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.orangeButton]} onPress={() => navigation.navigate('הוספת רכב')}>
                            <Icon name="directions-car" size={24} color="white" />
                            <Text style={styles.buttonText}>הוספת רכב</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.redButton]} onPress={() => navigation.navigate('דיווח על אירוע')}>
                            <Icon name="error-outline" size={24} color="white" />
                            <Text style={styles.buttonText}>מצב חירום</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.grayButton]} onPress={() => navigation.navigate('דף פרופיל')}>
                            <Icon name="account-circle" size={24} color="white" />
                            <Text style={styles.buttonText}>פרופיל</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
    style={[styles.button, styles.greenButton]}
    onPress={() => navigation.navigate('NotificationsManagement')}
>
    <Icon name="notifications" size={24} color="white" />
    <Text style={styles.buttonText}>נהל את ההתראות שלי</Text>
</TouchableOpacity>

                    <View style={styles.yellowButtonContainer}>
                        <TouchableOpacity style={styles.yellowButton} onPress={() => navigation.navigate('נורות התראה')}>
                            <Icon name="warning" size={24} color="white" />
                            <Text style={styles.yellowButtonText}>נדלקה לי נורה מה לעשות?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('4%'),
        backgroundColor: '#f8f8f8',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: hp('-4%'),
        marginTop: hp('5%'),
    },
    logo: {
        width: 300,
        height: 210,
    },
    logoutButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#AD40AF',
        padding: 10,
        borderRadius: 10,
    },
    welcomeText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: hp('2%'),
    },
    userName: {
        color: '#AD40AF',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: wp('4%'),
        color: '#AD40AF',
    },
    carContainer: {
        width: wp('85%'),
        padding: wp('4%'),
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    carTitle: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center', // מרכז את התוכן אנכית
        alignItems: 'center', // מרכז את התוכן אופקית
        width: wp('30%'),
        marginLeft:14,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: wp('4%'),
        textAlign: 'center', // מרכז את הטקסט
    },
    missingCarText: {
        fontSize: wp('4%'),
        color: 'red',
        textAlign: 'center',
    },
    divider: {
        backgroundColor: '#d3d3d3',
        height: 2,
        marginVertical: hp('3%'),
    },
    menu: {
        marginTop: hp('2%'),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1%'),
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        padding: wp('4%'),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp('2%'),
    },
    greenButton: {
        backgroundColor: 'green',
    },
    orangeButton: {
        backgroundColor: 'orange',
    },
    redButton: {
        backgroundColor: 'red',
    },
    grayButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        fontSize: wp('4%'),
        color: 'white',
        marginLeft: wp('2%'),
    },
    yellowButtonContainer: {
        marginBottom: hp('3%'),
    },
    yellowButton: {
        backgroundColor: 'yellow',
        padding: wp('4%'),
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('1%'),
    },
    yellowButtonText: {
        fontSize: wp('5%'),
        color: 'black',
        marginLeft: wp('2%'),
    },
    editButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
        justifyContent: 'center', // מרכז את התוכן אנכית
        alignItems: 'center', // מרכז את התוכן אופקית
        width: wp('33%')
    },
    editButtonText: {
        color: 'white',
        fontSize: wp('5%'),
        textAlign: 'center', // מרכז את הטקסט
    },
    saveButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    buttonText: {
        fontSize: wp('4%'),
        color: 'white',

    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
        textAlign: 'center',
    },
    carImage: {
        width: 120,
        height: 120,
    },
    logoutButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 95,
        height: 40,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        justifyContent: 'center',
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '100%',
        borderRadius: 10,

    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomePage;

