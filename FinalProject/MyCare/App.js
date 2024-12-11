import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from './Pages/Login';
import Register from './Pages/Register';
import HomePage from './Pages/HomePage';
import UserManagementScreen from './Pages/UserManagementScreen';
import AddVehicleScreen from './Pages/AddVehicleScreen';
import NearbyGarages from './Pages/NearbyGarages';
import IncidentReportScreen from './Pages/IncidentReportScreen';
import WarningLightsScreen from './Pages/WarningLightsScreen';
import NotificationsManagement from './Pages/NotificationsManagement'; // ייבוא דף ניהול התראות

// יצירת Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// יצירת תפריט טאבים
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'דף הבית') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'דף פרופיל') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'הוספת רכב') {
                        iconName = focused ? 'car' : 'car-outline';
                    } else if (route.name === 'מוסכים קרובים') {
                        iconName = focused ? 'construct' : 'construct-outline'; 
                    } else if (route.name === 'נורות התראה') {
                        iconName = focused ? 'warning' : 'warning-outline'; 
                    } else if (route.name === 'דיווח על אירוע') {
                        iconName = focused ? 'alert' : 'alert-outline'; 
                    } else if (route.name === 'ניהול התראות') {
                        iconName = focused ? 'notifications' : 'notifications-outline'; 
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'purple',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="דף הבית" component={HomePage} />
            <Tab.Screen name="דף פרופיל" component={UserManagementScreen} />
            <Tab.Screen name="הוספת רכב" component={AddVehicleScreen} />
            <Tab.Screen name="מוסכים קרובים" component={NearbyGarages} />
            <Tab.Screen name="נורות התראה" component={WarningLightsScreen} />
            <Tab.Screen name="דיווח על אירוע" component={IncidentReportScreen} />
            <Tab.Screen name="ניהול התראות" component={NotificationsManagement} /> 
        </Tab.Navigator>
    );
}

// האפליקציה הראשית
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="NearbyGarages" component={NearbyGarages} />
                <Stack.Screen name="IncidentReportScreen" component={IncidentReportScreen} />
                <Stack.Screen name="WarningLightsScreen" component={WarningLightsScreen} />
                <Stack.Screen name="NotificationsManagement" component={NotificationsManagement} /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
}
