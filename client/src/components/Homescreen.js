// src/components/FilterRoomsScreen.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Room from './Room'; // Ensure the correct path
import Loader from './Loader'; // Component to show loading state
import Error from './Error'; // Component to show error messages
import { DatePicker, Select, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Slider from 'react-slick';
import {Header} from './header'; // Corrected import
import Footer from './Footer'; // Ensure the correct path
import styles from '../FilterRoomsScreen.module.css'; // Import CSS Module

// Import Slick Carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import defaultBackground from '../images/default-image.jpg';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

function FilterRoomsScreen() {
  const [rooms, setRooms] = useState(null); // Initialize as null to differentiate from empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [amenity, setAmenity] = useState([]);
  const [capacity, setCapacity] = useState('all');

  // UI states
  const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const sliderRef = useRef(null);

  const amenitiesOptions = [
    { value: 'all', label: 'All Amenities' },
    { value: 'WiFi', label: 'Wi-Fi' },
    { value: 'Whiteboard', label: 'Whiteboard' },
    { value: 'Projector', label: 'Projector' },
    { value: 'Video Conferencing', label: 'Video Conferencing' },
    { value: 'Air-Conditioner', label: 'Air Conditioning' },
    { value: 'Smartboard', label: 'Smartboard' },
    { value: 'Coffee machine', label: 'CoffeeMachine' },
    { value: 'TeleVision', label: 'Smartboard' },
    { value: 'Sound system', label: 'Sound system' },
    { value: 'Conference Phone', label: 'Conference Phone' },
  ];

  
  const capacityOptions = [
    { value: 'all', label: 'All Capacities' },
    { value: '1-5', label: '1-5 Persons' },
    { value: '5-10', label: '5-10 Persons' },
    { value: '10-15', label: '10-15 Persons' },
    { value: '15-20', label: '15-20 Persons' },
    { value: '20-25', label: '20-25 Persons' },
    { value: '25-30', label: '25-30 Persons' },
  ];

  // Fetch rooms whenever any filter changes
  useEffect(() => {
    if (fromDate && toDate && startTime && endTime) {
      fetchFilteredRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, startTime, endTime, searchKey, amenity, capacity]);

  // Function to fetch filtered rooms from the backend
  const fetchFilteredRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterData = {
        fromDate,
        toDate,
        startTime,
        endTime,
        capacity: capacity !== 'all' ? capacity : null,
        amenities: amenity.length > 0 && amenity.includes('all') ? [] : amenity,
        searchKey: searchKey || null,
      };

      console.log('Sending filter data:', filterData);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/rooms/filterRooms`
        , filterData);

      console.log('Received response:', response.data);

      if (response.data.success) {
        const roomsData = response.data.rooms.map(room => ({
          ...room,
          amenities: Array.isArray(room.amenities)
            ? room.amenities
            : typeof room.amenities === 'string'
            ? JSON.parse(room.amenities)
            : [],
        }));

        setRooms(roomsData);

        if (roomsData.length > 0 && roomsData[0].imageurl) {
          setBackgroundImage(roomsData[0].imageurl);
          setSelectedRoom(roomsData[0]);
        } else {
          setBackgroundImage(defaultBackground);
          setSelectedRoom(null);
        }
      } else {
        setError(response.data.message || 'No rooms found matching the criteria.');
        setRooms([]);
        setBackgroundImage(defaultBackground);
        setSelectedRoom(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching filtered rooms:', error);
      setError(error.response?.data?.message || 'Something went wrong while fetching rooms.');
      setLoading(false);
    }
  };

  // Handle date and time changes
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setFromDate(start.format('YYYY-MM-DD'));
      setToDate(end.format('YYYY-MM-DD'));
      setStartTime(start.format('HH:mm'));
      setEndTime(end.format('HH:mm'));
    } else {
      setFromDate(null);
      setToDate(null);
      setStartTime(null);
      setEndTime(null);
    }
  };

  // Handle search input changes
  const handleSearchKeyChange = (e) => setSearchKey(e.target.value);

  // Handle amenity selection
  const handleAmenityChange = (values) => {
    setAmenity(values);
  };

  // Handle capacity selection
  const handleCapacityChange = (value) => setCapacity(value);

  // View room details or proceed to booking
  const viewRoom = (roomId) => {
    if (!fromDate || !toDate || !startTime || !endTime) {
      alert('Please select valid dates and times.');
      return;
    }

    navigate(`/room/${roomId}`, {
      state: {
        fromDate,
        toDate,
        startTime,
        endTime,
      },
    });
  };

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: rooms ? Math.min(rooms.length, 3) : 3,
    slidesToScroll: 1,
    nextArrow: false,
    prevArrow: false,
    
    afterChange: (index) => handleSlideChange(index),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: rooms ? Math.min(rooms.length, 2) : 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Handle slide change to update background image and selected room
  const handleSlideChange = (index) => {
    if (rooms && rooms[index] && rooms[index].imageurl) {
      setBackgroundImage(rooms[index].imageurl);
      setSelectedRoom(rooms[index]);
    } else {
      setBackgroundImage(defaultBackground);
      setSelectedRoom(null);
    }
  };

  // Handle Reset Button Click
  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStartTime(null);
    setEndTime(null);
    setSearchKey('');
    setAmenity([]);
    setCapacity('all');
    setRooms(null);
    setBackgroundImage(defaultBackground);
    setSelectedRoom(null);
    setError(null);
  };

  return (
    <>
      <Header /> {/* Add the Header component here */}
      <motion.div
        className={styles.filterRoomsContainer}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
          minHeight: '100vh',
          position: 'relative',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Overlay to darken the background for better readability */}
        <div
          className={styles.overlay}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        ></div>

        {/* Filters Section */}
        <motion.div
          className={styles.filtersSection}
          style={{
            position: 'relative',
            zIndex: 2,
            paddingTop: '50px', // Adjusted padding to move filters upwards
            paddingBottom: '50px',
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.sectionTitle}>
            <h2>Find Your Perfect Room</h2>
          </div>
          <div className={styles.filtersRow}>
            {/* Date and Time Range Picker */}
            <div className={styles.filterCol}>
              <RangePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: 'HH:mm' }}
                onChange={handleDateChange}
                className={styles.rangePicker}
                placeholder={['Start Date & Time', 'End Date & Time']}
              />
            </div>

            {/* Amenity Selector */}
            <div className={styles.filterCol}>
              <Select
                mode="multiple" // Enable multiple selection
                value={amenity}
                onChange={handleAmenityChange}
                className={styles.selectField}
                size="large"
                placeholder="Select Amenities"
                allowClear
              >
                {amenitiesOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Capacity Selector */}
            <div className={styles.filterCol}>
              <Select
                value={capacity}
                onChange={handleCapacityChange}
                className={styles.selectField}
                size="large"
                placeholder="Select Capacity"
                allowClear
              >
                {capacityOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Reset Filters Button */}
           
          </div>
        </motion.div>

        {/* Rooms Carousel */}
        <motion.div
          className={styles.carouselSection}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Custom Arrows Positioned Above the Carousel */}
          {rooms && rooms.length > 0 && (
            <div className={styles.carouselCustomArrows}>
              <button
                onClick={() => sliderRef.current.slickPrev()}
                className={styles.customArrow}
              >
                ←
              </button>
              <button
                onClick={() => sliderRef.current.slickNext()}
                className={styles.customArrow}
              >
                →
              </button>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <Error message={error} />
          ) : rooms === null ? (
            <div className={styles.errorContainer}>
              
            </div>
          ) : rooms.length === 0 ? (
            <div className={styles.errorContainer}>
              <h3>No rooms found matching the criteria.</h3>
            </div>
          ) : (
            <Slider ref={sliderRef} {...sliderSettings}>
              {rooms.map(room => (
                <div key={room.id} className={styles.carouselItem}>
                  <Room
                    room={room}
                    onView={() => viewRoom(room.id)}
                    onSelect={() => setSelectedRoom(room)}
                    selected={selectedRoom && selectedRoom.id === room.id}
                  />
                </div>
              ))}
            </Slider>
          )}
        </motion.div>

        {/* Room Details Overlay */}
        {selectedRoom && (
          <motion.div
          className={styles.roomDetails}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Title Animation */}
          <motion.h2
            className={styles.roomDetailsTitle}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {selectedRoom.name}
          </motion.h2>
        
          {/* Description Animation */}
          <motion.p
            className={styles.roomDetailsDescription}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {selectedRoom.description}
          </motion.p>
        
          {/* Capacity Animation */}
          <motion.p
            className={styles.roomDetailsCapacity}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Capacity: {selectedRoom.capacity} {selectedRoom.capacity > 1 ? 'Persons' : 'Person'}
          </motion.p>
        
          {/* Amenities Animation */}
          <motion.p
            className={styles.roomDetailsAmenities}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Amenities:{" "}
            {selectedRoom.amenities && selectedRoom.amenities.length > 0
              ? selectedRoom.amenities.join(', ')
              : 'No amenities available'}
          </motion.p>
        
          {/* Button Animation */}
          <motion.button
            type="primary"
            onClick={() => viewRoom(selectedRoom.id)}
            className={styles.roomDetailsButton}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(150, 40, 0, 0.964)' }} // Hover effect
            whileTap={{ scale: 0.95 }} // Tap effect
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            View
          </motion.button>
        </motion.div>
        
        )}
      </motion.div>
      <Footer />
    </>
  );
}

export default FilterRoomsScreen;
