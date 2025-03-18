// CartScreen.js
import customParseFormat from 'dayjs/plugin/customParseFormat';

import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for icons

dayjs.extend(customParseFormat);
// Define color constants
const COLORS = {
  primary: '#FFFFFF',      // White
  secondary: '#000000',    // Black
  accent: '#8B4513',       // SaddleBrown
  error: '#FF6347',        // Tomato for errors
  border: '#CCCCCC',       // Light gray for borders
  shadow: '#000000',       // Black for shadows
};

function CartScreen() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false); // New state for confirming booking
  const navigation = useNavigation();

  // Function to fetch cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true); // Start loading state
      const user = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(user);

      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://192.168.0.166:5000/api/cart/user/${currentUser.id}`
      );
      console.log('Fetched cart items:', response.data);
      setCart(response.data.cartItems);
    } catch (error) {
      console.error('Failed to fetch cart items', error);
      Alert.alert('Error', 'Failed to load cart items');
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Fetch cart items every time the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems(); // Fetch cart items when the screen is focused
    }, [])
  );

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://192.168.0.166:5000/api/cart/${cartItemId}`);
      setCart(cart.filter((item) => item.id !== cartItemId));
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      Alert.alert('Error', 'Error removing item from cart');
    }
  };

  const confirmBooking = async () => {
    Alert.alert(
      'Confirm Booking',
      'Are you sure you want to confirm the booking for all items?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setConfirming(true); // Disable the button while confirming
            try {
              const user = await AsyncStorage.getItem('user');
              const currentUser = JSON.parse(user);

              if (!currentUser) {
                Alert.alert('Error', 'User not logged in');
                setConfirming(false);
                return;
              }

              await Promise.all(
                cart.map(async (item) => {
                  const bookingDetails = {
                    roomId: item.roomId,
                    userId: currentUser.id,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    startTime: item.startTime,
                    endTime: item.endTime,
                  };

                  await axios.post('http://192.168.0.166:5000/api/bookings/bookroom', bookingDetails);
                })
              );

              // Clear the cart on the backend after booking
              await axios.delete(`http://192.168.0.166:5000/api/cart/clear/${currentUser.id}`);

              // Clear the cart in the app state
              setCart([]); // Set cart to empty after successful booking

              Alert.alert('Success', 'Booking confirmed!');
              navigation.navigate('Bookings'); // Navigate to Bookings Tab
            } catch (err) {
              console.error('Booking error:', err.response ? err.response.data : err.message);
              Alert.alert(
                'Error',
                `Error confirming bookings: ${
                  err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message
                }`
              );
            } finally {
              setConfirming(false); // Re-enable the button after confirmation
            }
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => {
    const formattedFromDate = dayjs(item.fromDate).isValid()
      ? dayjs(item.fromDate).format('YYYY-MM-DD')
      : 'Invalid Date';
    const formattedToDate = dayjs(item.toDate).isValid()
      ? dayjs(item.toDate).format('YYYY-MM-DD')
      : 'Invalid Date';

    const parsedStartTime = dayjs(item.startTime, ['HH:mm:ss', 'HH:mm']);
    const parsedEndTime = dayjs(item.endTime, ['HH:mm:ss', 'HH:mm']);

    const formattedStartTime = parsedStartTime.isValid()
      ? parsedStartTime.format('h:mm A')
      : 'Invalid Time';
    const formattedEndTime = parsedEndTime.isValid()
      ? parsedEndTime.format('h:mm A')
      : 'Invalid Time';

    return (
      <View style={styles.cartItem}>
        <View style={styles.itemHeader}>
          <Text style={styles.roomName}>
            {item.Room.name} ({item.Room.capacity} {item.Room.capacity > 1 ? 'persons' : 'person'})
          </Text>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeIcon}>
            <Icon name="trash-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>From:</Text> {formattedFromDate}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>To:</Text> {formattedToDate}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Start Time:</Text> {formattedStartTime}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>End Time:</Text> {formattedEndTime}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 20 }} />
      ) : cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            onPress={confirmBooking}
            style={[styles.confirmButton, confirming && styles.buttonDisabled]}
            disabled={confirming} // Disable button while confirming
          >
            {confirming ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.buttonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary, // White background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary, // Black text
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#F5F5F5', // Light gray background for cart items
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 2, // For Android shadow
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary, // Black text
    flex: 1,
    paddingRight: 10,
  },
  removeIcon: {
    padding: 5,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.secondary, // Black text
    marginTop: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: COLORS.secondary, // Brown background
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4, // For Android shadow
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // DarkGray when disabled
  },
  buttonText: {
    color: COLORS.primary, // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: COLORS.secondary, // Black text
  },
});

export default CartScreen;
