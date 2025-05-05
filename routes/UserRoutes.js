const express = require('express');
const router = express.Router();
const { Booking, User, Room, sequelize } = require('../models');

// Register route
router.post('/register', async (req, res) => {
  console.log('🔍 Register payload:', req.body); 
  const { email, password, name, department, contactInfo } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.warn('⚠️ Registration blocked—email already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const newUser = await User.create({
        email,
        password,
        name,
        department,
        contactInfo,
        role: 'employee'
      });
  
      res.status(201).json({ user: newUser });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  });
  
  

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({
      where: { email, password }, // Check if both match
      attributes: ['id', 'email', 'name', 'department', 'contactInfo', 'role'],
    });

    // Check if user exists and credentials match
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login failed error:', err); // Log the error details
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: 'User not found' });
    }
  });
  
  // Update user profile
  router.put('/:id', async (req, res) => {
    const { name, department, contactInfo } = req.body;
    try {
      const user = await User.findByPk(req.params.id);
      user.name = name || user.name;
      user.department = department || user.department;
      user.contactInfo = contactInfo || user.contactInfo;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update profile' });
    }
  });

module.exports = router;