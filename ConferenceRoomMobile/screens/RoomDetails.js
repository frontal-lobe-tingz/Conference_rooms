// RoomDetails.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for icons

// Define color constants
const COLORS = {
  primary: '#FFFFFF',      // White
  secondary: '#000000',    // Black
  accent: '#8B4513',       // SaddleBrown
  error: '#FF6347',        // Tomato for errors
  border: '#CCCCCC',       // Light gray for borders
  shadow: '#000000',       // Black for shadows
};

function RoomDetails() {
  const route = useRoute();
  const navigation = useNavigation();

  // Destructure all necessary params
  const { roomId, fromDate, toDate, startTime, endTime } = route.params;

  const [room, setRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to load current user', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://192.168.0.166:5000/api/rooms/${roomId}`
        );
        setRoom(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Only fetch if roomId exists
    if (roomId) {
      fetchRoomDetails();
    } else {
      setError('No roomId provided');
      setLoading(false);
    }
  }, [roomId]);

  // Optional: Log route.params to verify
  useEffect(() => {
    console.log('Route Params:', route.params);
  }, [route.params]);

  const parsedFromDate = dayjs(fromDate, 'YYYY-MM-DD');
  const parsedToDate = dayjs(toDate, 'YYYY-MM-DD');

  const formattedFromDate = parsedFromDate.isValid()
    ? parsedFromDate.format('YYYY-MM-DD')
    : 'Invalid Date';
  const formattedToDate = parsedToDate.isValid()
    ? parsedToDate.format('YYYY-MM-DD')
    : 'Invalid Date';

  async function bookRoom() {
    try {
      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      if (!currentUser.id) {
        Alert.alert('Error', 'User ID is missing');
        return;
      }

      const bookingDetails = {
        roomId: room.id,
        userId: currentUser.id,
        fromDate,
        toDate,
        startTime,
        endTime,
      };

      await axios.post(
        'http://192.168.0.166:5000/api/bookings/bookroom',
        bookingDetails
      );
      Alert.alert('Success', 'Booking successful');
      navigation.navigate('Bookings'); // Navigate to Bookings Tab
    } catch (err) {
      console.error(
        'Booking error:',
        err.response ? err.response.data : err.message
      );
      Alert.alert(
        'Error',
        'Error during booking: ' +
          (err.response ? JSON.stringify(err.response.data) : err.message)
      );
    }
  }

  const addToCart = async () => {
    try {
      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const bookingDetails = {
        roomId: room.id,
        userId: currentUser.id,
        fromDate,
        toDate,
        startTime,
        endTime,
      };

      const response = await axios.post(
        'http://192.168.0.166:5000/api/cart/add',
        bookingDetails
      );
      if (response.data.success) {
        Alert.alert('Success', 'Room added to cart');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to add room to cart'
        );
      }
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error.response ? error.response.data : error.message
      );
      Alert.alert('Error', 'Error adding room to cart');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : room ? (
        <View style={styles.content}>
          {/* Room Name */}
          <Text style={styles.roomName}>{room.name}</Text>

          {/* Room Image */}
          <View style={styles.imageContainer}>
            <Image
              source={
                room.imageurl
                  ? { uri: room.imageurl }
                  : require('../assets/default-image.jpg')
              }
              style={styles.roomImage}
            />
            <Text style={styles.amenitiesText}>
              Amenities: {Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}
            </Text>
          </View>

          {/* Booking Details */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Name:</Text> {currentUser ? currentUser.name : 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>From Date:</Text> {formattedFromDate}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>To Date:</Text> {formattedToDate}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Start Time:</Text> {startTime}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>End Time:</Text> {endTime}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Max Capacity:</Text> {room.capacity} {room.capacity > 1 ? 'Persons' : 'Person'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={addToCart}
              accessibilityLabel="Add room to cart"
            >
              <Icon name="cart-outline" size={20} color={COLORS.primary} />
              <Text style={styles.buttonText}> Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={bookRoom}
              accessibilityLabel="Book room"
            >
              <Icon name="checkmark-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.buttonText}> Book Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

// Define styles before export
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.primary, // White background
    paddingBottom: 40,
  },
  content: {
    backgroundColor: COLORS.primary,
  },
  roomName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary, // Black text
    marginBottom: 15,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roomImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover', // Ensures the image covers the space
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenitiesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.secondary, // Black text
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.secondary, // Black text
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: COLORS.secondary, // Black text
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary, // Brown background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: COLORS.primary, // White text
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error, // Tomato (error color)
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default RoomDetails;
