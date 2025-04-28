import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion'; // Import Framer Motion
import '../ViewAllBookings.css'; // Import custom styles if needed

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

  const fetchBookings = () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    if (!userId) {
      setError('User not found. Please log in.');
      setLoading(false);
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/allbookings?userId=${userId}`)
      .then(response => {
        console.log('Response data:', response.data); // Debugging line
        if (response.data.success) {
          if (Array.isArray(response.data.bookings)) {
            setBookings(response.data.bookings); // Correctly set to the bookings array
          } else {
            console.error('Bookings data is not an array:', response.data.bookings);
            setError('Invalid bookings data format.');
          }
        } else {
          setError(response.data.message || 'Failed to fetch bookings');
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching bookings');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      setError('Error canceling booking');
    }
  };

  const handleUpdate = async (bookingId, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`, updatedData);
      fetchBookings();
      setEditingBookingId(null);
    } catch (error) {
      setError('Error updating booking');
    }
  };

  const handleEditChange = (e) => {
    setUpdatedBookingData({ ...updatedBookingData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bookings-container">
      <h2>All Bookings</h2>
      {Array.isArray(bookings) && bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <motion.ul 
          className="bookings-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {Array.isArray(bookings) && bookings.map((booking) => {
            const formattedFromDate = dayjs(booking.fromDate).format('MMM D, YYYY');
            const formattedStartTime = dayjs(booking.startTime, 'HH:mm:ss').format('h:mm A');
            const formattedToDate = dayjs(booking.toDate).format('MMM D, YYYY');
            const formattedEndTime = dayjs(booking.endTime, 'HH:mm:ss').format('h:mm A');

            return (
              <motion.li 
                key={booking.id} 
                className="booking-item"
                whileHover={{ scale: 1.02 }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ x: -100, opacity: 0 }}
              >
                <h3>Room: {booking.Room.name}</h3>
                <p>
                  Booked by User: {booking.User?.name || 'Unknown User'}<br />
                  Email: {booking.User?.email || 'No email available'}
                </p>
                <p>
                  From: {formattedFromDate} at {formattedStartTime} <br />
                  To: {formattedToDate} at {formattedEndTime}
                </p>
                <p>Status: <strong style={booking.status === 'confirmed' ? styles.confirmedStatus : styles.pendingStatus}>{booking.status}</strong></p>

                <div className="booking-actions">
                  <button style={styles.cancelButton} onClick={() => handleCancel(booking.id)}>Cancel Booking</button>
                  <button style={styles.updateButton} onClick={() => setEditingBookingId(booking.id)}>Edit Booking</button>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {editingBookingId && (
        <motion.div
          className="edit-booking-form"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Edit Booking</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(editingBookingId, {
              ...updatedBookingData,
              fromDate: dayjs(updatedBookingData.fromDate).format('YYYY-MM-DD'),
              toDate: dayjs(updatedBookingData.toDate).format('YYYY-MM-DD'),
              startTime: dayjs(updatedBookingData.startTime, 'HH:mm').format('HH:mm:ss'),
              endTime: dayjs(updatedBookingData.endTime, 'HH:mm').format('HH:mm:ss'),
            });
          }}>
            <input
              type="date"
              name="fromDate"
              value={updatedBookingData.fromDate}
              onChange={handleEditChange}
              placeholder="From Date"
              required
            />
            <input
              type="date"
              name="toDate"
              value={updatedBookingData.toDate}
              onChange={handleEditChange}
              placeholder="To Date"
              required
            />
            <input
              type="time"
              name="startTime"
              value={updatedBookingData.startTime}
              onChange={handleEditChange}
              placeholder="Start Time"
              required
            />
            <input
              type="time"
              name="endTime"
              value={updatedBookingData.endTime}
              onChange={handleEditChange}
              placeholder="End Time"
              required
            />
            <button type="submit">Update</button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

// Styles for the booking list
const styles = {
  bookingItem: {
    padding: '15px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  },
  confirmedStatus: {
    color: 'green',
  },
  pendingStatus: {
    color: 'orange',
  },
  cancelButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  updateButton: {
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ViewAllBookings;
