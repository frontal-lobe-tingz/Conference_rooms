import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, fromDate, toDate, userId } = location.state || {};

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        roomId: room.id,
        userId,
        fromDate,
        toDate,
        status: 'booked',
      };

      // Send booking data to the server
      await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, bookingData);

      alert('Room successfully booked!');
      navigate('/'); // Redirect to home or another screen
    } catch (error) {
      console.error('Error booking the room:', error);
      alert('Failed to book the room. Please try again.');
    }
  };

  if (!room || !fromDate || !toDate) {
    return <div>No booking details available</div>;
  }

  return (
    <div className="booking-summary">
      <h1>Booking Confirmation</h1>
      <img src={room.imageURL} alt={room.name} />
      <h2>{room.name}</h2>
      <p>{room.description}</p>
      <p>Capacity: {room.capacity}</p>
      <p>Amenities: {room.amenities.join(', ')}</p>
      <p>From: {fromDate}</p>
      <p>To: {toDate}</p>
      <button className="btn btn-success mt-3" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
}

export default BookingScreen;
