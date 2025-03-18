// FilterRoomsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for icons

dayjs.extend(isBetween);

const { width: viewportWidth } = Dimensions.get('window');

// Define color constants
const COLORS = {
  primary: '#FFFFFF',      // White
  secondary: '#000000',    // Black
  accent: '#8B4513',       // SaddleBrown
  error: '#FF6347',        // Tomato for errors
  placeholder: '#888888',  // Gray for placeholders
  border: '#CCCCCC',       // Light gray for borders
  shadow: '#000000',       // Black for shadows
};

function FilterRoomsScreen() {
  const [rooms, setRooms] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [capacity, setCapacity] = useState('all');

  const navigation = useNavigation();

  // Amenities options
  const amenitiesOptions = [
    { id: 'WiFi', name: 'WiFi' },
    { id: 'Whiteboard', name: 'Whiteboard' },
    { id: 'Projector', name: 'Projector' },
    { id: 'Video Conferencing', name: 'Video Conferencing' },
    { id: 'AC', name: 'Air Conditioning' },
    { id: 'Smartboard', name: 'Smartboard' },
  ];

  // Capacity options
  const capacityOptions = [
    { label: 'All Capacities', value: 'all' },
    { label: '1-5 Persons', value: '1-5' },
    { label: '5-10 Persons', value: '5-10' },
    { label: '10-15 Persons', value: '10-15' },
    { label: '15-20 Persons', value: '15-20' },
  ];

  // Function to toggle amenity selection
  const toggleAmenity = (amenityId) => {
    if (amenities.includes(amenityId)) {
      setAmenities(amenities.filter((id) => id !== amenityId));
    } else {
      setAmenities([...amenities, amenityId]);
    }
  };

  // Function to fetch filtered rooms from the backend
  const fetchFilteredRooms = async () => {
    if (!fromDate || !toDate || !startTime || !endTime) {
      Alert.alert('Error', 'Please select valid dates and times.');
      return;
    }

    const selectedFromDateTime = dayjs(fromDate)
      .hour(dayjs(startTime).hour())
      .minute(dayjs(startTime).minute())
      .second(dayjs(startTime).second());

    const selectedToDateTime = dayjs(toDate)
      .hour(dayjs(endTime).hour())
      .minute(dayjs(endTime).minute())
      .second(dayjs(endTime).second());

    if (!selectedFromDateTime.isBefore(selectedToDateTime)) {
      Alert.alert('Error', 'From date/time must be before To date/time.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const filterData = {
        fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
        toDate: dayjs(toDate).format('YYYY-MM-DD'),
        startTime: dayjs(startTime).format('HH:mm:ss'), // Include seconds
        endTime: dayjs(endTime).format('HH:mm:ss'),     // Include seconds
        capacity: capacity !== 'all' ? capacity : null,
        amenities: amenities.length > 0 ? amenities : [],
        searchKey: searchKey || null,
      };

      console.log('Sending filter data:', filterData); // Log the filter data

      const response = await axios.post(
        'http://192.168.0.166:5000/api/rooms/filterRooms',
        filterData
      );

      console.log('Response data:', response.data); // Log the entire response

      if (response.data.success) {
        const roomsData = response.data.rooms;
        console.log('Rooms received:', roomsData); // Log the rooms data
        setRooms(roomsData);
      } else {
        setRooms([]);
        Alert.alert(response.data.message || 'No rooms found matching the criteria.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching filtered rooms:', error);
      setError(error.response?.data?.message || 'Something went wrong while fetching rooms.');
      setLoading(false);
    }
  };

  // Date and Time Picker Functions
  const showFromDatepicker = () => {
    DateTimePickerAndroid.open({
      value: fromDate || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setFromDate(selectedDate);
          // Automatically show time picker after selecting date
          showStartTimepicker(selectedDate);
        }
      },
      mode: 'date',
      display: 'default',
    });
  };

  const showStartTimepicker = (date = new Date()) => {
    DateTimePickerAndroid.open({
      value: startTime || date,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setStartTime(selectedTime);
        }
      },
      mode: 'time',
      is24Hour: true,
      display: 'default',
    });
  };

  const showToDatepicker = () => {
    DateTimePickerAndroid.open({
      value: toDate || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setToDate(selectedDate);
          // Automatically show time picker after selecting date
          showEndTimepicker(selectedDate);
        }
      },
      mode: 'date',
      display: 'default',
    });
  };

  const showEndTimepicker = (date = new Date()) => {
    DateTimePickerAndroid.open({
      value: endTime || date,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setEndTime(selectedTime);
        }
      },
      mode: 'time',
      is24Hour: true,
      display: 'default',
    });
  };

  // View room details
  const viewRoom = (roomId) => {
    if (!fromDate || !toDate || !startTime || !endTime) {
      Alert.alert('Error', 'Please select valid dates and times.');
      return;
    }

    navigation.navigate('RoomDetails', {
      roomId,
      fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
      toDate: dayjs(toDate).format('YYYY-MM-DD'),
      startTime: dayjs(startTime).format('HH:mm:ss'), // Include seconds
      endTime: dayjs(endTime).format('HH:mm:ss'),     // Include seconds
    });
  };

  // Render each room for the carousel
  const renderRoomItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => viewRoom(item.id)}
      style={styles.carouselItem}
    >
      <Image
        source={
          item.imageurl
            ? { uri: item.imageurl }
            : require('../assets/default-image.jpg')
        }
        style={styles.roomImage}
      />
      <Text style={styles.roomTitle}>{item.name}</Text>
      <Text style={styles.roomInfo}>{item.capacity} persons</Text>
      <Text style={styles.roomDescription}>{item.description}</Text>
      <Text style={styles.roomAmenities}>
        Amenities: {Array.isArray(item.amenities) ? item.amenities.join(', ') : item.amenities}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Date pickers */}
      <TouchableOpacity onPress={showFromDatepicker} style={styles.dateTimeContainer}>
        <Icon name="calendar-outline" size={24} color={COLORS.secondary} />
        <Text style={styles.dateTimeText}>
          {fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : 'Select From Date'}
        </Text>
      </TouchableOpacity>

      {fromDate && (
        <TouchableOpacity onPress={() => showStartTimepicker()} style={styles.dateTimeContainer}>
          <Icon name="time-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.dateTimeText}>
            {startTime ? dayjs(startTime).format('HH:mm:ss') : 'Select Start Time'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={showToDatepicker} style={styles.dateTimeContainer}>
        <Icon name="calendar-outline" size={24} color={COLORS.secondary} />
        <Text style={styles.dateTimeText}>
          {toDate ? dayjs(toDate).format('YYYY-MM-DD') : 'Select To Date'}
        </Text>
      </TouchableOpacity>

      {toDate && (
        <TouchableOpacity onPress={() => showEndTimepicker()} style={styles.dateTimeContainer}>
          <Icon name="time-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.dateTimeText}>
            {endTime ? dayjs(endTime).format('HH:mm:ss') : 'Select End Time'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Search input */}
      <TextInput
        placeholder="Search rooms"
        value={searchKey}
        onChangeText={(text) => setSearchKey(text)}
        style={styles.searchInput}
        placeholderTextColor={COLORS.placeholder}
        onSubmitEditing={() => fetchFilteredRooms()}
      />

      {/* Amenities filter */}
      <Text style={styles.filterLabel}>Select Amenities:</Text>
      <View style={styles.amenitiesContainer}>
        {amenitiesOptions.map((amenity) => (
          <TouchableOpacity
            key={amenity.id}
            style={styles.checkboxContainer}
            onPress={() => toggleAmenity(amenity.id)}
          >
            <View style={styles.checkbox}>
              {amenities.includes(amenity.id) && <View style={styles.checked} />}
            </View>
            <Text style={styles.label}>{amenity.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Capacity filter */}
      <Text style={styles.filterLabel}>Select Capacity:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={capacity}
          onValueChange={(itemValue) => setCapacity(itemValue)}
          mode="dropdown"
          style={styles.picker}
          dropdownIconColor={COLORS.secondary}
        >
          {capacityOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {/* Apply Filters Button */}
      <TouchableOpacity
        onPress={fetchFilteredRooms}
        style={styles.applyButton}
      >
        <Icon name="filter" size={20} color={COLORS.secondary} />
        <Text style={styles.applyButtonText}> Apply Filters</Text>
      </TouchableOpacity>

      {/* Room carousel */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : rooms === null ? (
        <Text style={styles.infoText}>
          Please select filters and apply.
        </Text>
      ) : rooms.length > 0 ? (
        <View style={styles.carouselContainer}>
          <Carousel
            width={viewportWidth * 0.8}
            height={400}
            data={rooms}
            renderItem={renderRoomItem}
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: 'left',
              stackInterval: 18,
            }}
            loop={false}
            autoPlay={false}
          />
        </View>
      ) : (
        <Text style={styles.infoText}>
          No rooms found.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.primary, // White background
    paddingBottom: 40,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border, // Light gray border
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.primary, // White background
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.secondary, // Black text
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: COLORS.border, // Light gray border
    color: COLORS.secondary, // Black text
    fontSize: 16,
    backgroundColor: COLORS.primary, // White background
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.secondary, // Black text
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%', // Adjust as needed
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary, // Brown border
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.accent, // Brown fill
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    color: COLORS.secondary, // Black text
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.accent, // Brown border
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: COLORS.primary, // White background
  },
  picker: {
    height: 50,
    width: '100%',
    color: COLORS.secondary, // Black text
  },
  applyButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary, // Brown
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  applyButtonText: {
    color: COLORS.primary, // White text
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5, // Space between icon and text
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselItem: {
    backgroundColor: COLORS.primary, // White background for room cards
    borderRadius: 12, // Increased border radius for smoother edges
    width: viewportWidth * 0.8,
    height: 400,
    padding: 15,
    alignItems: 'center',
    shadowColor: COLORS.shadow, // Black shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // For Android shadow
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover', // Ensures the image covers the space
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.secondary, // Black text
  },
  roomInfo: {
    fontSize: 16,
    marginTop: 5,
    color: COLORS.secondary, // Black text
  },
  roomDescription: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    color: COLORS.secondary, // Black text
  },
  roomAmenities: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
    color: COLORS.secondary, // Black text
  },
  errorText: {
    color: COLORS.error, // Tomato (error color)
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: COLORS.secondary, // Black text
  },
});

export default FilterRoomsScreen;
