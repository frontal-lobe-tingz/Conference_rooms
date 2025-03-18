// ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './colors'; // Ensure the path is correct

const API_BASE_URL = 'http://192.168.0.166:5000/api'; // Replace with your server URL

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        if (user) {
          setUserId(user.id);
          setUsername(user.username || '');
          setName(user.name);
          setDepartment(user.department || '');
          setContactInfo(user.contactInfo || '');
        } else {
          // If no user is stored, navigate to Login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (error) {
        console.error('Failed to load user data', error);
        Alert.alert('Error', 'Failed to load user data. Please log in again.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Function to handle profile update
  const handleUpdate = async () => {
    // Simple validation
    if (!name.trim() || !department.trim() || !contactInfo.trim()) {
      Alert.alert('Validation Error', 'Name, Department, and Contact Info are required.');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, {
        username,
        name,
        department,
        contactInfo,
      });

      // Save the updated user information in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Function to handle profile deletion
  const handleDeleteProfile = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await axios.delete(`${API_BASE_URL}/users/${userId}`);
              
              // Clear AsyncStorage and navigate to the login screen
              await AsyncStorage.removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

              Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            } catch (error) {
              console.error('Failed to delete account', error);
              Alert.alert('Error', 'Failed to delete account.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Failed to logout', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Username Input */}
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
      />

      {/* Name Input */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
      />

      {/* Department Input */}
      <TextInput
        value={department}
        onChangeText={setDepartment}
        placeholder="Department"
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
      />

      {/* Contact Info Input */}
      <TextInput
        value={contactInfo}
        onChangeText={setContactInfo}
        placeholder="Contact Info"
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
      />

      {/* Update Profile Button */}
      <TouchableOpacity 
        style={styles.updateButton} 
        onPress={handleUpdate} 
        disabled={updating}
      >
        <Text style={styles.buttonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
      </TouchableOpacity>

      {/* Delete Profile Button */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteProfile} 
        disabled={deleting}
      >
        <Text style={styles.deleteButtonText}>{deleting ? 'Deleting...' : 'Delete Account'}</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    color: COLORS.text,
  },
  updateButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
