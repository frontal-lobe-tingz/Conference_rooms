// App.js

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabs from './MainTabs'; // Bottom Tab Navigator

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';


const Stack = createStackNavigator();

const App = () => {
  let [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Bold': Roboto_700Bold,
  });

 

  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setInitialRoute('MainTabs');
        }
      } catch (error) {
        console.error('Failed to load user', error);
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>

        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />

        {/* Main Application Tabs */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />

        {/* Remove the duplicated RoomDetails screen from here */}
        {/* <Stack.Screen 
          name="RoomDetails" 
          component={RoomDetails} 
          options={{ title: 'Room Details' }} 
        /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
