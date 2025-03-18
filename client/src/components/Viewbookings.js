import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../ViewBookings.css'; // Ensure this path is correct

const Viewbookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Optional: Show a console log when fetching starts
        console.log('Fetching bookings from backend...');
        
        const response = await axios.get('http://localhost:5000/api/bookings/allbookings2');

        // Log the entire response for debugging
        console.log('Response received:', response);

        // Check if the response structure is as expected
        if (response.data && response.data.success && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
        } else {
          // Handle unexpected response structure
          console.error('Unexpected response structure:', response.data);
          setError('Unexpected response structure from server.');
        }
        setLoading(false);
      } catch (err) {
        // Log the error details
        console.error('Failed to fetch bookings:', err);

        // Determine the error message
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Failed to fetch bookings.'}`);
        } else if (err.request) {
          // Request was made but no response received
          setError('No response from server. Please check your network connection.');
        } else {
          // Something else caused the error
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const makeRoomUnavailable = async (roomId) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/${roomId}/unavailable`);
      alert('Room marked as unavailable');
      
      // Optionally, refetch bookings to reflect the change
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.Room.id === roomId ? { ...booking, Room: { ...booking.Room, available: false } } : booking
        )
      );
    } catch (error) {
      console.error('Failed to update room availability:', error);
      alert('Failed to update room availability. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <motion.div
      className="view-bookings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Bookings</h2>
      <motion.table
        className="bookings-table"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      >
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Room Name</th>
            <th>Room Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <motion.tr
              key={booking.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 150 }}
            >
              <td>{booking.User?.name || 'N/A'}</td>
              <td>{booking.User?.email || 'N/A'}</td>
              <td>{booking.Room?.name || 'N/A'}</td>
              <td>{booking.Room?.description || 'N/A'}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => makeRoomUnavailable(booking.Room?.id)}
                  disabled={!booking.Room?.available}
                >
                  Make Room Unavailable
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default Viewbookings;
