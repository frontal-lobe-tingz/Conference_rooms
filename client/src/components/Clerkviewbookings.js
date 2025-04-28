import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import '../ClerkViewAll.css'; // Import the CSS for styling

const ClerkViewAll = () => {
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

  // Fetch all bookings when the component mounts
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/allbookings2`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching bookings');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`);
      fetchBookings(); // Refresh the bookings after deletion
    } catch (error) {
      setError('Error canceling booking');
      console.error(error);
    }
  };

  const finalizeBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to finalize this booking?')) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}/finalize`);
      if (response.data.success) {
        alert(response.data.message);
        fetchBookings(); // Refresh bookings
      } else {
        alert(response.data.message || 'Failed to finalize booking');
      }
    } catch (err) {
      alert('Error finalizing booking');
      console.error(err);
    }
  };

  // Reset booking after conference
  const resetBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reset this booking?')) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}/reset`);
      if (response.data.success) {
        alert(response.data.message);
        fetchBookings(); // Refresh bookings
      } else {
        alert(response.data.message || 'Failed to reset booking');
      }
    } catch (err) {
      alert('Error resetting booking');
      console.error(err);
    }
  };

  // Update booking
  const handleUpdate = async (bookingId, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`, updatedData);
      fetchBookings(); // Refresh the bookings after update
      setEditingBookingId(null); // Reset the editing mode
    } catch (error) {
      setError('Error updating booking');
      console.error(error);
    }
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    setUpdatedBookingData({ ...updatedBookingData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <motion.div
      className="clerk-view-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mt-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <motion.table
          className="table table-striped mt-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Booked By</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Amenities Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const formattedFromDate = dayjs(booking.fromDate).format('MMM D, YYYY');
              const formattedStartTime = dayjs(booking.startTime, 'HH:mm:ss').format('h:mm A');
              const formattedToDate = dayjs(booking.toDate).format('MMM D, YYYY');
              const formattedEndTime = dayjs(booking.endTime, 'HH:mm:ss').format('h:mm A');
              const amenities = Array.isArray(booking.Room.amenities)
                ? booking.Room.amenities.join(', ')
                : booking.Room.amenities;

              return (
                <motion.tr
                  key={booking.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 150 }}
                >
                  <td>{booking.id}</td>
                  <td>{booking.Room.name}</td>
                  <td>{booking.User.name} ({booking.User.email})</td>
                  <td>{formattedFromDate} at {formattedStartTime}</td>
                  <td>{formattedToDate} at {formattedEndTime}</td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'pending' ? 'badge-warning' :
                      booking.status === 'finalized' ? 'badge-success' :
                      booking.status === 'completed' ? 'badge-secondary' :
                      'badge-danger'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>{amenities}</td>
                  <td>
                    <button className="btn btn-sm btn-danger mr-2" onClick={() => handleCancel(booking.id)}>
                      Delete
                    </button>
                    {booking.status === 'pending' && (
                      <button className="btn btn-sm btn-primary" onClick={() => setEditingBookingId(booking.id)}>
                        Edit
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button className="btn btn-sm btn-primary ml-2" onClick={() => finalizeBooking(booking.id)}>
                        Finalize
                      </button>
                    )}
                    {booking.status === 'finalized' && (
                      <button className="btn btn-sm btn-secondary ml-2" onClick={() => resetBooking(booking.id)}>
                        Reset
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </motion.table>
      )}

      {editingBookingId && (
        <div className="mt-4">
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
              className="form-control mb-2"
            />
            <input
              type="date"
              name="toDate"
              value={updatedBookingData.toDate}
              onChange={handleEditChange}
              placeholder="To Date"
              className="form-control mb-2"
            />
            <input
              type="time"
              name="startTime"
              value={updatedBookingData.startTime}
              onChange={handleEditChange}
              placeholder="Start Time"
              className="form-control mb-2"
            />
            <input
              type="time"
              name="endTime"
              value={updatedBookingData.endTime}
              onChange={handleEditChange}
              placeholder="End Time"
              className="form-control mb-2"
            />
            <button type="submit" className="btn btn-primary">Update Booking</button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default ClerkViewAll;
