import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from 'dayjs';
import '../RoomDetails.css';

function RoomDetails() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    fromDate = '01-01-2024',
    toDate = '01-01-2024',
    startTime = '12:00',
    endTime = '13:00'
  } = location.state || {};

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/rooms/${roomId}`);
        setRoom(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const parsedFromDate = dayjs(fromDate, 'YYYY-MM-DD');
  const parsedToDate = dayjs(toDate, 'YYYY-MM-DD');

  const formattedFromDate = parsedFromDate.isValid() ? parsedFromDate.format('YYYY-MM-DD') : 'Invalid Date';
  const formattedToDate = parsedToDate.isValid() ? parsedToDate.format('YYYY-MM-DD') : 'Invalid Date';

  const totalDays = parsedToDate.isValid() && parsedFromDate.isValid()
    ? parsedToDate.diff(parsedFromDate, 'day') + 1
    : 0;

  async function bookRoom() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!currentUser) {
      alert('User not logged in');
      return;
    }
    
    if (!currentUser.id) {
      alert('User ID is missing');
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
    
    try {
      await axios.post('/api/bookings/bookroom', bookingDetails);
      alert('Booking successful');
      navigate('/view-all-bookings');
    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data : err.message);
      alert('Error during booking: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
    }
  }

  const addToCart = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      alert('User not logged in');
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
  
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', bookingDetails); // Updated endpoint to match the backend
      if (response.data.success) {
        alert('Room added to cart');
      } else {
        alert(response.data.message || 'Failed to add room to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      alert('Error adding room to cart');
    }
  };

  return (
    <div className="room-details-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : room ? (
        <div className="room-details-content">
           <h1>{room.name}</h1>
          <div className="room-image">
           
            <img 
              src={room.imageurl || '/path-to-default-image.jpg'} 
              alt={room.name} 
              className="smallimg" 
              onError={(e) => { e.target.src = '/path-to-default-image.jpg'; }} 
            />
            <p><strong>Amenities: {Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}</strong></p>
          </div>
          <div className="room-info">
            <h1>Booking Details</h1>
            <b>
              <p>Name: {JSON.parse(localStorage.getItem('user')).name}</p>
              <p>From Date: {formattedFromDate}</p>
              <p>To Date: {formattedToDate}</p>
              <p>Start Time: {startTime}</p>
              <p>End Time: {endTime}</p>
              <p>Max Capacity: <strong>{room.capacity}</strong></p>
            </b>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
              <button className="btn btn-primary" onClick={bookRoom}>Book Room</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RoomDetails;
