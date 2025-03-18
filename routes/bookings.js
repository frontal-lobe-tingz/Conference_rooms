const express = require('express');
const router = express.Router();
//const Booking = require('../models/Booking');
//const Room = require('../models/Room');
const dayjs = require('dayjs');
const { Op } = require('sequelize');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

//const User = require('../models/User'); // If you need user details


const { Booking, User, Room, sequelize } = require('../models');
 // Import models and sequelize


 router.get('/userBookingCounts', async (req, res) => {
  try {
    const usersWithBookingCounts = await Booking.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('userId')), 'bookingCount'],
      ],
      where: { status: 'finalized' }, // Only count finalized bookings
      group: ['userId'],
      include: [
        {
          model: User,
          as: 'User', // Specify the alias
          attributes: ['id', 'name', 'email', 'department', 'contactInfo'],
        },
      ],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
    });

    if (usersWithBookingCounts.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found with finalized bookings' });
    }

    const formattedResults = usersWithBookingCounts.map(item => ({
      user: item.User.name,
      bookingCount: item.get('bookingCount'),
    }));

    res.status(200).json({
      success: true,
      users: formattedResults,
    });
  } catch (error) {
    console.error('Error fetching users with finalized bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});
// Get the user with the most bookings
router.get('/topUser', async (req, res) => {
  try {
    const topUser = await Booking.findOne({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('userId')), 'bookingCount'],
      ],
      group: ['userId'],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email', 'department', 'contactInfo'],
        },
      ],
    });

    if (!topUser) {
      return res.status(404).json({ success: false, message: 'No bookings found' });
    }

    res.status(200).json({
      success: true,
      user: topUser.User,
      bookingCount: topUser.get('bookingCount'),
    });
  } catch (error) {
    console.error('Error fetching top user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch top user' });
  }
});

// Get all bookings with user and room details
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { 
          model: User, 
          as: 'User', // Specify the alias
          attributes: ['id', 'name', 'email', 'department', 'contactInfo'] 
        },
        { 
          model: Room, 
          as: 'Room', // Specify the alias
          attributes: ['id', 'name', 'description', 'capacity', 'amenities', 'available'] 
        },
      ],
      order: [['createdAt', 'DESC']],  // Optional: Order by latest bookings
    });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});


// Mark room as unavailable
router.put('/rooms/:id/unavailable', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    room.available = false;
    await room.save();
    res.json({ message: 'Room marked as unavailable' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room availability' });
  }
});
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'finalized', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await Booking.update({ status }, { where: { id } });
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
});
router.post('/bookroom', async (req, res) => {
  const { roomId, userId, fromDate, toDate, startTime, endTime } = req.body;

  // Log input values to ensure they're being passed correctly
  console.log('this backend user id', userId);
  console.log('fromDate:', fromDate, 'toDate:', toDate, 'startTime:', startTime, 'endTime:', endTime);

  // Validate required fields
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!roomId || !fromDate || !toDate || !startTime || !endTime) {
    return res.status(400).json({ message: 'All booking fields are required' });
  }

  try {
    // Convert the selected start and end date/time into Day.js objects
    const selectedStartTime = dayjs(`${fromDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const selectedEndTime = dayjs(`${toDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

    if (!selectedStartTime.isValid() || !selectedEndTime.isValid()) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // Check if any existing booking overlaps with the selected timeframe
    const existingBookings = await Booking.findAll({
      where: {
        roomId,
        [Op.or]: [
          {
            fromDate: { [Op.lte]: toDate },
            toDate: { [Op.gte]: fromDate },
          },
        ],
      },
    });

    // Check if any existing booking overlaps with the selected booking timeframe
    const isRoomAvailable = existingBookings.every((booking) => {
      const bookingStartTime = dayjs(`${booking.fromDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm');
      const bookingEndTime = dayjs(`${booking.toDate} ${booking.endTime}`, 'YYYY-MM-DD HH:mm');

      // Return true if there's no overlap, false otherwise
      return (
        !selectedStartTime.isBetween(bookingStartTime, bookingEndTime, null, '[]') &&
        !selectedEndTime.isBetween(bookingStartTime, bookingEndTime, null, '[]') &&
        !(
          selectedStartTime.isSame(bookingStartTime) || 
          selectedEndTime.isSame(bookingEndTime)
        )
      );
    });

    // If room is not available, send an error response
    if (!isRoomAvailable) {
      return res.status(400).json({ message: 'Room is already booked for this time frame' });
    }

    // Calculate total days for booking (optional)
    const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;

    // Room is available, proceed with creating the booking
    const newBooking = await Booking.create({
      userId,       // Correct field name
      roomId,
      fromDate,
      toDate,
      startTime,
      endTime,
      // totalDays, // Uncomment if added to the model
    });

    res.status(200).json({ message: 'Room booked successfully', booking: newBooking });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    console.error('Error booking room:', error);
    res.status(500).json({ message: 'Error booking room', error: error.message });
  }
});



router.get('/allbookings2', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'User', attributes: ['id', 'name', 'email'] }, // Alias 'User' must match the association
        { model: Room, as: 'Room', attributes: ['id', 'name', 'description'] }, // Alias 'Room' must match the association
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

module.exports = router;

router.get('/allbookings', async (req, res) => {
  try {
    const userId = req.query.userId;  // Get user ID from the query string

    console.log("this backend UserId:", userId); // Check userId on backend before querying
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required for fetching bookings' });
    }

    const bookings = await Booking.findAll({
      where: { userId: userId },  // Filter bookings by the user's ID
      include: [
        { 
          model: Room, 
          as: 'Room', // Specify the alias
          attributes: ['id', 'name', 'description', 'capacity', 'amenities', 'available'] 
        },
        { 
          model: User, 
          as: 'User', // Specify the alias
          attributes: ['id', 'name', 'email', 'department', 'contactInfo'] 
        },
      ],
      order: [['createdAt', 'DESC']], // Optional: Order by latest bookings
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/popularTimes - Fetch popular booking times
router.get('/popularTimes', async (req, res) => {
  try {
    // Get all finalized bookings
    const bookings = await Booking.findAll({
      where: { status: 'finalized' },
    });

    // Initialize an array to hold counts for each hour (0-23)
    const hours = Array(24).fill(0);

    bookings.forEach(booking => {
      const startDateTime = dayjs(`${booking.fromDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm');
      const endDateTime = dayjs(`${booking.toDate} ${booking.endTime}`, 'YYYY-MM-DD HH:mm');

      // Iterate over each hour in the booking timeframe
      let currentDateTime = startDateTime.startOf('hour');

      while (currentDateTime.isBefore(endDateTime)) {
        const hour = currentDateTime.hour();
        hours[hour] += 1;
        currentDateTime = currentDateTime.add(1, 'hour');
      }
    });

    // Prepare data for the chart
    const popularTimesData = hours.map((count, hour) => ({
      time: `${hour}:00`,
      bookings: count,
    }));

    res.status(200).json({ success: true, data: popularTimesData });
  } catch (error) {
    console.error('Error fetching popular times:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popular times' });
  }
});



// PUT /api/bookings/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await Booking.update(updatedData, { where: { id } });
    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.destroy({ where: { id } });
    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking' });
  }
});

// Finalize a booking (mark as 'finalized' and set room availability to false)
// Route: PUT /api/bookings/:id/finalize
router.put('/:id/finalize', async (req, res) => {
  console.log("PUT /bookings/:id/finalize route hit!");
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id, {
      include: { model: Room, as: 'Room' }, // Include the associated room
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be finalized' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.findAll({
      where: {
        roomId: booking.roomId,
        status: 'finalized',
        id: { [Op.ne]: booking.id }, // Exclude the current booking
        [Op.or]: [
          {
            fromDate: { [Op.lte]: booking.toDate },
            toDate: { [Op.gte]: booking.fromDate },
          },
        ],
      },
    });

    const hasOverlap = overlappingBookings.some((existingBooking) => {
      const existingStart = dayjs(`${existingBooking.fromDate} ${existingBooking.startTime}`, 'YYYY-MM-DD HH:mm');
      const existingEnd = dayjs(`${existingBooking.toDate} ${existingBooking.endTime}`, 'YYYY-MM-DD HH:mm');
      const newStart = dayjs(`${booking.fromDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm');
      const newEnd = dayjs(`${booking.toDate} ${booking.endTime}`, 'YYYY-MM-DD HH:mm');

      return (
        newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
      );
    });

    if (hasOverlap) {
      return res.status(400).json({ success: false, message: 'Room is already booked for this time frame' });
    }

    // Update booking status
    booking.status = 'finalized';
    await booking.save();

    res.json({ success: true, message: 'Booking finalized successfully', booking });
  } catch (error) {
    console.error('Error finalizing booking:', error);
    res.status(500).json({ success: false, message: 'Failed to finalize booking' });
  }
});

router.get('/test', (req, res) => {
  res.send("Test route working");
});

// Reset room availability after conference (set room as available and booking as completed)
router.put('/:id/reset', async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'finalized') {
      return res.status(400).json({ success: false, message: 'Only finalized bookings can be reset' });
    }

    // Update booking status
    booking.status = 'completed';
    await booking.save();

    res.json({ success: true, message: 'Booking marked as completed', booking });
  } catch (error) {
    console.error('Error resetting booking:', error);
    res.status(500).json({ success: false, message: 'Failed to reset booking' });
  }
});
router.post('/bookings/check-availability', async (req, res) => {
  const { selectedRooms, fromDate, toDate, startTime, endTime } = req.body;

  try {
    const result = await checkRoomAvailability(selectedRooms, fromDate, toDate, startTime, endTime);
    
    if (!result.available) {
      return res.status(400).json({ message: 'Some rooms are not available', unavailableRooms: result.unavailableRooms });
    }
    
    res.status(200).json({ message: 'All rooms are available' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking room availability' });
  }
});




module.exports = router;
