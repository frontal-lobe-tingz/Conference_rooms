// LoginScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for icons
import styles from './LoginStyles'; // Import the enhanced styles

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://192.168.0.166:5000/api/users/login', { email, password });
      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        // Navigate to MainTabs
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        setError('Invalid email or password.');
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred during login.');
      Alert.alert('Login Failed', 'An error occurred during login.');
    }

    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color={styles.placeholderColor} style={styles.iconContainer} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={styles.placeholderColor}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={styles.placeholderColor} style={styles.iconContainer} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={styles.placeholderColor}
            />
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            disabled={loading}
            accessibilityLabel="Login Button"
          >
            {loading ? (
              <ActivityIndicator size="small" color={styles.buttonText.color} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            accessibilityLabel="Navigate to Register Screen"
          >
            <Text style={styles.registerLink}>Don't have an account? Register here</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
