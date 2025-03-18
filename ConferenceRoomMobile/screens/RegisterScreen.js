// RegisterScreen.js

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
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './RegisterStyles'; // Import the enhanced styles

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define validation schema using Yup
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name is required'),
    department: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Department is required'),
    contactInfo: Yup.string()
      .min(5, 'Too Short!')
      .required('Contact Information is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Function to handle registration
  const handleRegister = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://192.168.0.166:5000/api/users/register', values);

      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        // Navigate to MainTabs
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        setError('Registration failed. Please try again.');
        Alert.alert('Registration Failed', 'Invalid response from server.');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Something went wrong.');
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong.');
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
          <Text style={styles.title}>Register</Text>

          <Formik
            initialValues={{ name: '', department: '', contactInfo: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
              handleRegister(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <Icon name="person-outline" size={20} color="#999999" style={styles.iconContainer} />
                  <TextInput
                    placeholder="Name"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    style={styles.input}
                    autoCapitalize="words"
                    placeholderTextColor="#999999"
                  />
                </View>
                {errors.name && touched.name ? (
                  <Text style={styles.errorMessage}>{errors.name}</Text>
                ) : null}

                {/* Department Input */}
                <View style={styles.inputContainer}>
                  <Icon name="business-outline" size={20} color="#999999" style={styles.iconContainer} />
                  <TextInput
                    placeholder="Department"
                    onChangeText={handleChange('department')}
                    onBlur={handleBlur('department')}
                    value={values.department}
                    style={styles.input}
                    autoCapitalize="words"
                    placeholderTextColor="#999999"
                  />
                </View>
                {errors.department && touched.department ? (
                  <Text style={styles.errorMessage}>{errors.department}</Text>
                ) : null}

                {/* Contact Information Input */}
                <View style={styles.inputContainer}>
                  <Icon name="call-outline" size={20} color="#999999" style={styles.iconContainer} />
                  <TextInput
                    placeholder="Contact Information"
                    onChangeText={handleChange('contactInfo')}
                    onBlur={handleBlur('contactInfo')}
                    value={values.contactInfo}
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholderTextColor="#999999"
                  />
                </View>
                {errors.contactInfo && touched.contactInfo ? (
                  <Text style={styles.errorMessage}>{errors.contactInfo}</Text>
                ) : null}

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Icon name="mail-outline" size={20} color="#999999" style={styles.iconContainer} />
                  <TextInput
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999999"
                  />
                </View>
                {errors.email && touched.email ? (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                ) : null}

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#999999" style={styles.iconContainer} />
                  <TextInput
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999999"
                  />
                </View>
                {errors.password && touched.password ? (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                ) : null}

                {/* Register Button */}
                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={handleSubmit} 
                  disabled={loading}
                  accessibilityLabel="Register Button"
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Register</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>

          {/* Register Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')} 
            style={styles.registerLinkContainer}
            accessibilityLabel="Navigate to Login Screen"
          >
            <Text style={styles.registerLink}>Already have an account? Login here</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
