import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleAddVehicle, loadCarDetails, createImage, fetchCustomerVehicles, uploadImageToCloudinary } from '../Controllers/AddVehicleController';
import * as ImagePicker from 'expo-image-picker';

const AddVehicleScreen = () => {
    const [vehicleDetails, setVehicleDetails] = useState({
        carNumber: '',
        customerId: '',
        manufacturer: '',
        yearOfManufacture: '',
        color: '',
        numberOfKilometers: '',
        insuranceExpiration: '',
        model: '',
        insuranceInfo: '', // שדה לבחירת תמונה או טקסט
    });
    const [image, setImage] = useState(null);
    const [insuranceImage, setInsuranceImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCustomerId = async () => {
            try {
                setLoading(true);
                const customerId = await AsyncStorage.getItem('userToken');
                if (customerId) {
                    setVehicleDetails(prevDetails => ({
                        ...prevDetails,
                        customerId: customerId,
                    }));
                } else {
                    console.error('No customer ID found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching customer ID:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerId();
    }, [navigation]);

    const handleInputChange = (field, value) => {
        setVehicleDetails(prevDetails => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setVehicleDetails(prevDetails => ({
            carNumber: '',
            customerId: prevDetails.customerId,
            manufacturer: '',
            yearOfManufacture: '',
            color: '',
            numberOfKilometers: '',
            insuranceExpiration: '',
            model: '',
            insuranceInfo: '',
        }));
        setImage(null);
        setInsuranceImage(null);
    };

    const pickInsuranceImageFromGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Error', 'הרשאת גלריה נדרשת');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setInsuranceImage(result.assets[0].uri);
            setVehicleDetails(prevDetails => ({ ...prevDetails, insuranceInfo: 'תמונה נבחרה' }));
        }
    };

    const captureInsuranceImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Error', 'הרשאת מצלמה נדרשת');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setInsuranceImage(result.assets[0].uri);
            setVehicleDetails(prevDetails => ({ ...prevDetails, insuranceInfo: 'תמונה נבחרה' }));
        }
    };

    const handleCarNumberChange = (text) => {
        setVehicleDetails(prevDetails => ({ ...prevDetails, carNumber: text }));
        if (text.length >= 7) {
            loadCarDetails(text, setVehicleDetails);
        }
    };

    useEffect(() => {
        if (vehicleDetails.manufacturer && vehicleDetails.model && vehicleDetails.color) {
            setImageLoading(true); // התחלת טעינה
            createImage(vehicleDetails.manufacturer, vehicleDetails.model, vehicleDetails.color, setImage)
                .then(() => setImageLoading(false)) // סיום טעינה בהצלחה
                .catch(error => {
                    console.error('Error creating image:', error);
                    setImageLoading(false); // סיום טעינה במקרה של כישלון
                });
        }
    }, [vehicleDetails.manufacturer, vehicleDetails.model, vehicleDetails.color]);

    const handleSubmit = async () => {
        if (!vehicleDetails.customerId) {
            Alert.alert('Error', 'Customer ID is required');
            return;
        }
    
        if (!insuranceImage && vehicleDetails.insuranceInfo.trim().toLowerCase() !== 'אין כרגע') {
            Alert.alert('Error', 'אנא בחר תמונה לביטוח או הזן "אין כרגע" בשדה.');
            return;
        }
    
        const requiredFields = ['carNumber', 'manufacturer', 'yearOfManufacture', 'color', 'numberOfKilometers', 'insuranceExpiration', 'model'];
        const missingFields = requiredFields.filter(field => !vehicleDetails[field]);
        if (missingFields.length > 0) {
            Alert.alert('Error', `The following fields are required: ${missingFields.join(', ')}`);
            return;
        }
    
        let insuranceImageUrl = null;
        if (insuranceImage) {
            insuranceImageUrl = await uploadImageToCloudinary(insuranceImage);
        }
    
        const updatedVehicleDetails = {
            ...vehicleDetails,
            imageURL: image,
            insuranceUrl: insuranceImageUrl || 'אין כרגע',
        };
    
        setLoading(true);
        const success = await handleAddVehicle(updatedVehicleDetails);
        setLoading(false);
        if (success) {
            const updatedCustomer = await fetchCustomerVehicles(vehicleDetails.customerId);
            if (updatedCustomer && updatedCustomer._id) {
                await AsyncStorage.setItem('user', JSON.stringify(updatedCustomer));
                navigation.navigate('MainTabs', { screen: 'דף הבית' });
                resetForm();
            } else {
                Alert.alert('Error', 'Failed to fetch updated customer data');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Image source={require('../assets/Reload_Page.gif')} style={styles.logo} />
                    <ActivityIndicator size="large" color="#AD40AF" />
                    <Text style={styles.loadingText}>טוען...</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    {imageLoading && (
                        <View style={styles.imageLoadingContainer}>
                            <ActivityIndicator size="small" color="#AD40AF" />
                            <Text style={styles.imageLoadingText}>יוצר תמונה של הרכב...</Text>
                        </View>
                    )}
                    {image && <Image source={{ uri: image }} style={styles.imageTop} />}
                    <Text style={styles.label}>מספר רכב:</Text>
                    <TextInput style={styles.input} value={vehicleDetails.carNumber} onChangeText={handleCarNumberChange} />
                    <Text style={styles.label}>יצרן:</Text>
                    <TextInput style={styles.input} value={vehicleDetails.manufacturer} onChangeText={text => handleInputChange('manufacturer', text)} />
                    <Text style={styles.label}>שנת ייצור:</Text>
                    <TextInput style={styles.input} value={vehicleDetails.yearOfManufacture} onChangeText={text => handleInputChange('yearOfManufacture', text)} />
                    <Text style={styles.label}>צבע:</Text>
                    <TextInput style={styles.input} value={vehicleDetails.color} onChangeText={text => handleInputChange('color', text)} />
                    <Text style={styles.label}>קילומטרז':</Text>
                    <TextInput style={styles.input} value={vehicleDetails.numberOfKilometers} onChangeText={text => handleInputChange('numberOfKilometers', text)} />
                    <Text style={styles.label}>מודל:</Text>
                    <TextInput style={styles.input} value={vehicleDetails.model} onChangeText={text => handleInputChange('model', text)} />
                    <Text style={styles.label}>תמונה לביטוח:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="הזן 'אין כרגע' או בחר תמונה"
                        value={vehicleDetails.insuranceInfo}
                        onChangeText={text => setVehicleDetails(prevDetails => ({ ...prevDetails, insuranceInfo: text }))}
                    />
                    <TouchableOpacity style={[styles.button, styles.grayButton]} onPress={pickInsuranceImageFromGallery}>
                        <Text style={styles.buttonText}>בחר תמונה לביטוח</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.orangeButton, { marginTop: 10 }]} onPress={captureInsuranceImage}>
                        <Text style={styles.buttonText}>צלם תמונה לביטוח</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>הוספת רכב</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8, textAlign: 'center' },
    button: { padding: 10, alignItems: 'center', borderRadius: 5 },
    grayButton: { backgroundColor: 'gray' },
    orangeButton: { backgroundColor: 'orange' },
    greenButton: { backgroundColor: 'green' ,marginTop:10},
    buttonText: { color: 'white', fontSize: 18 },
    logo: { width: 300, height: 300, marginBottom: 20 },
    imageTop: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#AD40AF' },
    imageLoadingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    imageLoadingText: { marginLeft: 10, fontSize: 16, color: '#AD40AF' },
});

export default AddVehicleScreen;
