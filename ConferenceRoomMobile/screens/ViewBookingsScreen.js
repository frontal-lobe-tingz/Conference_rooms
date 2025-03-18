import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  View, 
  Text, 
  FlatList, 
  Alert, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFocusEffect } from '@react-navigation/native';
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
  background: '#F5F5F5',   // Light gray background
  text: '#333333',         // Darker text for better readability
  buttonText: '#FFFFFF',   // White text for buttons
};

const ViewAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [updatedBookingData, setUpdatedBookingData] = useState({
    fromDate: '',
    toDate: '',
    startTime: '',
    endTime: '',
  });

  // Function to fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const user = await AsyncStorage.getItem('user'); // Retrieve user from AsyncStorage
      const currentUser = JSON.parse(user);
      const userId = currentUser ? currentUser.id : null;

      if (!userId) {
        setError('User not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://192.168.0.166:5000/api/bookings/allbookings?userId=${userId}`);
      
      if (response.data.success) {
        setBookings(response.data.bookings); // Set the bookings array
      } else {
        setError('Failed to fetch bookings');
      }

      setLoading(false);
    } catch (error) {
      setError('Error fetching bookings');
      setLoading(false);
    }
  };

  // Fetch bookings every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings(); // Re-fetch bookings whenever the screen is focused
    }, [])
  );

  // Function to handle cancellation
  const handleCancel = async bookingId => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.0.166:5000/api/bookings/${bookingId}`);
              Alert.alert('Success', 'Booking canceled successfully');
              fetchBookings(); // Re-fetch bookings after cancellation
            } catch (error) {
              Alert.alert('Error', 'Error canceling booking');
            }
          }
        },
      ]
    );
  };

  // Function to handle updates
  const handleUpdate = async (bookingId, updatedData) => {
    const { fromDate, toDate, startTime, endTime } = updatedData;
  
    // Validate date formats
    if (!dayjs(fromDate, 'YYYY-MM-DD', true).isValid()) {
      Alert.alert('Invalid Date', 'From Date must be in YYYY-MM-DD format.');
      return;
    }
    if (!dayjs(toDate, 'YYYY-MM-DD', true).isValid()) {
      Alert.alert('Invalid Date', 'To Date must be in YYYY-MM-DD format.');
      return;
    }
  
    // Validate time formats
    if (!dayjs(startTime, 'HH:mm:ss', true).isValid()) {
      Alert.alert('Invalid Time', 'Start Time must be in HH:mm:ss format.');
      return;
    }
    if (!dayjs(endTime, 'HH:mm:ss', true).isValid()) {
      Alert.alert('Invalid Time', 'End Time must be in HH:mm:ss format.');
      return;
    }
  
    // Ensure end time is after start time
    const start = dayjs(`${fromDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss');
    const end = dayjs(`${toDate} ${endTime}`, 'YYYY-MM-DD HH:mm:ss');
  
    if (!end.isAfter(start)) {
      Alert.alert('Invalid Time Range', 'End Time must be after Start Time.');
      return;
    }
  
    try {
      await axios.put(`http://192.168.0.166:5000/api/bookings/${bookingId}`, updatedData);
      Alert.alert('Success', 'Booking updated successfully');
      fetchBookings(); // Re-fetch bookings after updating
      setEditingBookingId(null); // Reset editing state
      setUpdatedBookingData({
        fromDate: '',
        toDate: '',
        startTime: '',
        endTime: '',
      }); // Reset form
    } catch (error) {
      Alert.alert('Error', 'Error updating booking');
    }
  };

  // Function to handle input changes
  const handleEditChange = (name, value) => {
    setUpdatedBookingData({ ...updatedBookingData, [name]: value });
  };

  // Function to format dates
  const formatDate = date => dayjs(date).isValid() ? dayjs(date).format('MMM D, YYYY') : 'Invalid Date';

  // Function to format times
  const formatTime = (time) => {
    if (dayjs(time, 'HH:mm', true).isValid()) {
      return dayjs(time, 'HH:mm').format('h:mm A');
    }
    if (dayjs(time, 'HH:mm:ss', true).isValid()) {
      return dayjs(time, 'HH:mm:ss').format('h:mm A');
    }
    return 'Invalid Time';
  };

  // Render function for each booking item
  const renderBookingItem = ({ item }) => {
    const formattedFromDate = formatDate(item.fromDate);
    const formattedStartTime = formatTime(item.startTime);
    const formattedToDate = formatDate(item.toDate);
    const formattedEndTime = formatTime(item.endTime);

    return (
      <View style={styles.bookingItem}>
        <View style={styles.itemHeader}>
          <Text style={styles.roomName}>
            {item.Room?.name || 'N/A'} ({item.Room?.capacity || 'N/A'} {item.Room?.capacity > 1 ? 'persons' : 'person'})
          </Text>
          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.iconButton}>
              <Icon name="trash-outline" size={24} color={COLORS.error} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingBookingId(item.id)} style={styles.iconButton}>
              <Icon name="pencil-outline" size={24} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Booked by:</Text> {item.User?.name || 'Unknown User'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>Email:</Text> {item.User?.email || 'No email available'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>From:</Text> {formattedFromDate} at {formattedStartTime}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.boldText}>To:</Text> {formattedToDate} at {formattedEndTime}
        </Text>
        <Text style={styles.statusText}>Status: {item.status || 'N/A'}</Text>
      </View>
    );
  };

  // If loading, show ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // If there's an error, show error message and retry button
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBookings}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={item => item.id.toString()}
      renderItem={renderBookingItem}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Text style={styles.heading}>All Bookings</Text>
      }
      ListEmptyComponent={
        <Text style={styles.noBookingsText}>No bookings found</Text>
      }
      ListFooterComponent={
        editingBookingId && (
          <View style={styles.editForm}>
            <Text style={styles.editHeading}>Edit Booking</Text>
            <TextInput
              style={styles.input}
              value={updatedBookingData.fromDate}
              onChangeText={value => handleEditChange('fromDate', value)}
              placeholder="From Date (YYYY-MM-DD)"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={updatedBookingData.toDate}
              onChangeText={value => handleEditChange('toDate', value)}
              placeholder="To Date (YYYY-MM-DD)"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={updatedBookingData.startTime}
              onChangeText={value => handleEditChange('startTime', value)}
              placeholder="Start Time (HH:mm)"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={updatedBookingData.endTime}
              onChangeText={value => handleEditChange('endTime', value)}
              placeholder="End Time (HH:mm)"
              placeholderTextColor="#999"
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() =>
                  handleUpdate(editingBookingId, {
                    fromDate: dayjs(updatedBookingData.fromDate).format('YYYY-MM-DD'),
                    toDate: dayjs(updatedBookingData.toDate).format('YYYY-MM-DD'),
                    startTime: dayjs(updatedBookingData.startTime, 'HH:mm').format('HH:mm:ss'),
                    endTime: dayjs(updatedBookingData.endTime, 'HH:mm').format('HH:mm:ss'),
                  })
                }
              >
                <Text style={styles.buttonText}>Update Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={() => {
                  setEditingBookingId(null);
                  setUpdatedBookingData({
                    fromDate: '',
                    toDate: '',
                    startTime: '',
                    endTime: '',
                  });
                }}
              >
                <Text style={styles.buttonText}>Cancel Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  noBookingsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  bookingItem: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    paddingRight: 10,
  },
  actionIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  editForm: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.primary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelEditButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ViewAllBookings;
