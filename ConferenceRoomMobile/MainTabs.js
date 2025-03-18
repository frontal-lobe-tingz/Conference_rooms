// MainTabs.js

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './colors'; // Ensure this path is correct

// Importing Screens
import FilterRoomsScreen from './screens/FilterRoomsScreen'; // Home Screen
import RoomDetails from './screens/RoomDetails';
import CartScreen from './screens/CartScreen';
import ViewBookingsScreen from './screens/ViewBookingsScreen';
import ProfileUpdateScreen from './screens/ProfileUpdateScreen';
import AdminPanelScreen from './screens/AdminPanelScreen'; // Optional: For Admins/Clerks

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const BookingsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AdminStack = createStackNavigator();

// Stack Navigators with Consistent Header Styles
const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.tabBackground, // Brown background for headers
  },
  headerTintColor: COLORS.buttonText, // White text for header titles
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
};

// Home Stack Navigator
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen 
      name="HomeMain" // Renamed from "Home" to "HomeMain"
      component={FilterRoomsScreen} 
      options={{ headerTitle: 'Home' }}
    />
    <HomeStack.Screen 
      name="RoomDetails" 
      component={RoomDetails} 
      options={{ headerTitle: 'Room Details' }}
    />
  </HomeStack.Navigator>
);

// Cart Stack Navigator
const CartStackScreen = () => (
  <CartStack.Navigator screenOptions={screenOptions}>
    <CartStack.Screen 
      name="CartMain" // Renamed from "Cart" to "CartMain"
      component={CartScreen} 
      options={{ headerTitle: 'Your Cart' }}
    />
    {/* Add more screens related to Cart if needed */}
  </CartStack.Navigator>
);

// Bookings Stack Navigator
const BookingsStackScreen = () => (
  <BookingsStack.Navigator screenOptions={screenOptions}>
    <BookingsStack.Screen 
      name="BookingsMain" // Renamed from "Bookings" to "BookingsMain"
      component={ViewBookingsScreen} 
      options={{ headerTitle: 'Your Bookings' }}
    />
    {/* Add more screens related to Bookings if needed */}
  </BookingsStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={screenOptions}>
    <ProfileStack.Screen 
      name="ProfileMain" // Renamed from "Profile" to "ProfileMain"
      component={ProfileUpdateScreen} 
      options={{ headerTitle: 'Your Profile' }}
    />
    {/* Add more screens related to Profile if needed */}
  </ProfileStack.Navigator>
);

// Admin Stack Navigator (Optional)
const AdminStackScreen = () => (
  <AdminStack.Navigator screenOptions={screenOptions}>
    <AdminStack.Screen 
      name="AdminPanelMain" // Renamed from "AdminPanel" to "AdminPanelMain"
      component={AdminPanelScreen} 
      options={{ headerTitle: 'Admin Panel' }}
    />
    {/* Add more screens related to Admin if needed */}
  </AdminStack.Navigator>
);

const MainTabs = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser?.role);
      } catch (error) {
        console.error('Failed to get user role', error);
      } finally {
        setLoading(false);
      }
    };
    getUserRole();
  }, []);

  if (loading) {
    // Display a loading indicator while fetching user role
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // Configure icons for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Bookings':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'AdminPanel':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.tabInactive,   // Brown for active icons
        tabBarInactiveTintColor: COLORS.tabInactive, // White for inactive icons
        tabBarStyle: {
          backgroundColor: COLORS.tabBackground, // Black background for tab bar
          borderTopWidth: 0,
          elevation: 10, // Adds shadow on Android
        },
        headerShown: false, // Hide header for bottom tabs
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackScreen} 
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStackScreen} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsStackScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackScreen} 
      />

      {/* Conditionally render AdminPanel tab based on user role */}
      {(userRole === 'admin' || userRole === 'clerk') && (
        <Tab.Screen 
          name="AdminPanel" 
          component={AdminStackScreen} 
          options={{
            tabBarBadge: 3, // Example badge, can be dynamic
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// Stylesheet for MainTabs.js
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background, // Ensure background matches your design
  },
});

export default MainTabs;
