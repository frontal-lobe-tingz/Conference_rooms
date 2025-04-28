import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import '../CartScreen.css'; 
import dayjs from 'dayjs';

function CartScreen() {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();


  const {
    fromDate = '01-01-2024',
    toDate = '01-01-2024',
    startTime = '12:00',
    endTime = '13:00'
  } = location.state || {};

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
          alert('User not logged in');
          return;
        }
    
        const response = await axios.get(`http://localhost:5000/api/cart/user/${currentUser.id}`);
        console.log('Fetched cart items:', response.data); 
        
        setCart(response.data.cartItems); 
      } catch (error) {
        console.error('Failed to fetch cart items', error);
        alert('Failed to load cart items');
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      setCart(cart.filter((item) => item.id !== cartItemId));
      alert('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      alert('Error removing item from cart');
    }
  };

  const confirmBooking = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        alert('User not logged in');
        return;
      }
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/confirm/${currentUser.id}`);
  
      alert('Booking confirmed!');
      setCart([]); 
      navigate('/view-all-bookings');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Error confirming bookings');
    }
  };

  return (
    <div className="cart-container">
      <motion.h1 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Your Cart
      </motion.h1>
      {cart.length > 0 ? (
        <>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="cart-list"
          >
{cart.map((item) => {
  // Log startTime and endTime to debug their values
  console.log('Fetched cart item startTime:', item.startTime, 'endTime:', item.endTime);

  const formattedFromDate = dayjs(item.fromDate).isValid() ? dayjs(item.fromDate).format('YYYY-MM-DD') : 'Invalid Date';
  const formattedToDate = dayjs(item.toDate).isValid() ? dayjs(item.toDate).format('YYYY-MM-DD') : 'Invalid Date';

  // Parsing and formatting the start and end times
  const parsedStartTime = dayjs(item.startTime, ['HH:mm:ss', 'HH:mm']);
  const parsedEndTime = dayjs(item.endTime, ['HH:mm:ss', 'HH:mm']);

  const formattedStartTime = parsedStartTime.isValid() ? parsedStartTime.format('h:mm A') : 'Invalid Time';
  const formattedEndTime = parsedEndTime.isValid() ? parsedEndTime.format('h:mm A') : 'Invalid Time';

  return (
    <motion.li 
      key={item.id} 
      className="cart-item"
      whileHover={{ scale: 1.05 }}
    >
      <p className="cart-room-name">{item.Room.name} ({item.Room.capacity} persons)</p>
      <p>From: {formattedFromDate} - To: {formattedToDate}</p>
      <p>
        Start Time: {formattedStartTime} - 
        End Time: {formattedEndTime}
      </p>
      <button 
        className="remove-button" 
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </motion.li>
  );
})}

          </motion.ul>
          <motion.button 
            className="confirm-button"
            onClick={confirmBooking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Confirm Booking
          </motion.button>
        </>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your cart is empty
        </motion.p>
      )}
    </div>
  );
}

export default CartScreen;
