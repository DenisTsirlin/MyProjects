import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, I18nManager } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

I18nManager.forceRTL(true);

const NearbyGarages = ({ navigation, route }) => {
    const [location, setLocation] = useState(null);
    const [garages, setGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carManufacturer, setCarManufacturer] = useState(route?.params?.manufacturer || null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            fetchGarages(loc.coords.latitude, loc.coords.longitude);
        })();
    }, []);

    const fetchGarages = async (latitude, longitude) => {
        const manufacturer = carManufacturer ? carManufacturer.split(' ')[0] : ''; // חיתוך המילה הראשונה

        const apiKey = 'AIzaSyBJEz_btTva9am00H9FozSYAf4Gu_wxyJw';
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=car_repair&key=${apiKey}`
            );
            const data = await response.json();
    
            if (data.results.length > 0) {
                setGarages(data.results);
            } else {
                setGarages([]);
                Alert.alert('שגיאה', 'לא נמצאו מוסכים מורשים בקרבת מקום.');
            }
        } catch (error) {
            Alert.alert('שגיאה בטעינת המוסכים', error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // רדיוס כדור הארץ בק"מ
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // מרחק בק"מ
    };

    const sortByRating = () => {
        const sorted = [...garages].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setGarages(sorted);
    };

    const sortByDistance = () => {
        const sorted = [...garages].sort((a, b) => {
            const distA = calculateDistance(location.latitude, location.longitude, a.geometry.location.lat, a.geometry.location.lng);
            const distB = calculateDistance(location.latitude, location.longitude, b.geometry.location.lat, b.geometry.location.lng);
            return distA - distB;
        });
        setGarages(sorted);
    };

    const filterByOpenNow = () => {
        const filtered = garages.filter(garage => garage.opening_hours && garage.opening_hours.open_now);
        setGarages(filtered);
    };

    const filterByAuthorizedGarage = () => {
        if (!carManufacturer) {
            Alert.alert("Error", "לא הוזן יצרן רכב.");
            return;
        }

        const manufacturer = carManufacturer.toLowerCase();
        const filtered = garages.filter(garage =>
            garage.name.toLowerCase().includes(manufacturer)
        );

        if (filtered.length === 0) {
            Alert.alert("שגיאה", "לא נמצאו מוסכים מורשים ליצרן זה.");
        }
        setGarages(filtered);
    };

    const openGoogleMaps = (garageLocation) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${garageLocation.lat},${garageLocation.lng}&travelmode=driving`;
        Linking.openURL(url);
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>מוסכים קרובים אליך</Text>
            <Text style={styles.subtitle}>בחר מוסך הקרוב אליך ולחץ כדי לנווט למקום</Text>

            {/* כפתורי סינון */}
            <View style={styles.filterContainer}>
                <View style={styles.filterRow}>
                    <TouchableOpacity style={styles.filterButton} onPress={sortByDistance}>
                        <Text style={styles.filterButtonText}>מיקום</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={filterByOpenNow}>
                        <Text style={styles.filterButtonText}>פתוח עכשיו</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={sortByRating}>
                        <Text style={styles.filterButtonText}>דירוג</Text>
                    </TouchableOpacity>
                </View>
               
            </View>

            {loading ? (
                <Text style={styles.loadingText}>טוען מוסכים קרובים...</Text>
            ) : (
                <FlatList
                    data={garages}
                    keyExtractor={item => item.place_id}
                    renderItem={({ item }) => (
                        <View style={styles.garageItem}>
                            <Text style={styles.garageName}>{item.name}</Text>
                            <Text style={styles.garageVicinity}>{item.vicinity}</Text>
                            <Text style={styles.garageRating}>דירוג: {item.rating || 'לא זמין'}</Text>
                            <TouchableOpacity onPress={() => openGoogleMaps(item.geometry.location)}>
                                <Text style={styles.navigateText}>נווט לשם</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {garages.map(garage => (
                        <Marker
                            key={garage.place_id}
                            coordinate={{
                                latitude: garage.geometry.location.lat,
                                longitude: garage.geometry.location.lng,
                            }}
                            title={garage.name}
                            description={garage.vicinity}
                        />
                    ))}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: 'purple', textAlign: 'center', marginBottom: 5 },
    subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 10 },
    filterContainer: { marginBottom: 20 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    filterButton: { backgroundColor: 'purple', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
    authorizedGarageContainer: { alignItems: 'center', marginTop: 10 },
    authorizedButton: { backgroundColor: 'purple', width: '80%' },
    filterButtonText: { color: 'white', fontSize: 16, textAlign: 'center' },
    garageItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    garageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    garageVicinity: { fontSize: 16, color: '#666', marginVertical: 5 },
    garageRating: { fontSize: 16, color: '#444' },
    navigateText: { color: 'blue', marginTop: 5 },
    map: { width: '100%', height: 200, marginTop: 20 },
    loadingText: { textAlign: 'center', fontSize: 16, color: 'gray' },
});

export default NearbyGarages;