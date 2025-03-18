const express = require('express');
//const Cart = require('../models/Cart');
//const Booking = require('../models/Booking');
const router = express.Router();

const { Booking,Cart,Sequelize } = require('../models');

// Add item to cart
router.post('/add', async (req, res) => {
    try {
      const newItem = await Cart.create(req.body);
      res.status(201).json({ success: true, message: 'Item added to cart', cartItem: newItem });
    } catch (error) {
      console.error('Failed to add item to cart:', error); // Log error for debugging
      res.status(500).json({ success: false, message: 'Failed to add item to cart', error: error.message });
    }
  });

// Get cart items for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ 
      where: { userId: req.params.userId },
      include: ['Room'] // Make sure Room association is included
    });
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart items', error });
  }
});

// Delete an item from the cart
router.delete('/:cartItemId', async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.cartItemId);
    if (cartItem) {
      await cartItem.destroy();
      res.status(200).json({ success: true, message: 'Item removed from cart' });
    } else {
      res.status(404).json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove cart item', error });
  }
});

// Clear all cart items for a user
router.delete('/clear/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const cartItems = await Cart.findAll({ where: { userId } });
  
      if (cartItems.length > 0) {
        await Cart.destroy({ where: { userId } });
        res.status(200).json({ success: true, message: 'All cart items cleared' });
      } else {
        res.status(404).json({ success: false, message: 'No cart items found for this user' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to clear cart items', error });
    }
  });
  

// Update cart item
router.put('/:cartItemId', async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.cartItemId);
    if (cartItem) {
      await cartItem.update(req.body);
      res.status(200).json({ success: true, message: 'Cart item updated successfully', updatedCartItem: cartItem });
    } else {
      res.status(404).json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart item', error });
  }
});

// Confirm bookings from cart
router.post('/confirm/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ where: { userId: req.params.userId } });
    await Promise.all(cartItems.map(async (item) => {
      await Booking.create({
        userId: item.userId,
        roomId: item.roomId,
        fromDate: item.fromDate,
        toDate: item.toDate,
        startTime: item.startTime,
        endTime: item.endTime,
        status: 'pending'
      });
      await item.destroy(); // Remove item from cart after booking
    }));
    res.status(200).json({ success: true, message: 'All cart items booked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm bookings', error });
  }
});

module.exports = router;
