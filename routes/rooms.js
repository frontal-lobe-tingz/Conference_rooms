// routes/rooms.js

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const { sequelize, Room, Booking, User, Cart } = require('../models'); // Centralized import
const { Op, Sequelize } = require('sequelize'); // Import Op and Sequelize directly

dayjs.extend(isBetween);

// Configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original filename
  }
});

const upload = multer({ storage: storage });

// === Specific Routes ===

// 1. Route to get most popular rooms
router.get('/popularRooms', async (req, res) => {
  try {
    console.log('Fetching popular rooms');
    const popularRooms = await Room.findAll({
      include: [
        {
          model: Booking,
          as: 'Bookings',
          attributes: [],
          where: { status: { [Op.in]: ['finalized', 'completed'] } },
        },
      ],
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('Bookings.id')), 'bookingCount'],
      ],
      group: ['Room.id'],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
    });

    console.log('Popular rooms fetched:', popularRooms);
    res.status(200).json(popularRooms);
  } catch (error) {
    console.error('Error fetching popular rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popular rooms' });
  }
});

// 2. Route to get rooms currently booked
router.get('/currentlyBookedRooms', async (req, res) => {
  try {
    const currentDateTime = dayjs();

    const bookedRooms = await Room.findAll({
      include: [
        {
          model: Booking,
          as: 'Bookings',
          where: {
            fromDate: { [Op.lte]: currentDateTime.format('YYYY-MM-DD') },
            toDate: { [Op.gte]: currentDateTime.format('YYYY-MM-DD') },
            startTime: { [Op.lte]: currentDateTime.format('HH:mm:ss') },
            endTime: { [Op.gte]: currentDateTime.format('HH:mm:ss') },
            status: 'finalized', // Only consider finalized bookings
          },
          attributes: [],
        },
      ],
    });

    res.status(200).json(bookedRooms);
  } catch (error) {
    console.error('Error fetching currently booked rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booked rooms' });
  }
});

// 3. Route to add Room via addRoom2 (manager only)
router.post('/addRoom2', async (req, res) => {
  const { userId, roomDetails } = req.body;

  try {
    // Find the user
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a manager
    if (user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Only managers can add rooms.' });
    }

    // Proceed to add room logic
    const newRoom = await Room.create(roomDetails);
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (err) {
    console.error('Error adding room via addRoom2:', err);
    res.status(400).json({ error: 'Failed to add room', details: err.message });
  }
});

// 4. Route to add a new room with image upload
router.post('/addroom', upload.single('image'), async (req, res) => {
  const { name, description, capacity, amenities } = req.body;

  try {
    // Parse amenities string (assuming it's coming as JSON array string from the front-end)
    const amenitiesArray = JSON.parse(amenities);

    // Create full URL for the image
    const imageUrl = req.file
      ? `${process.env.SERVER_BASE_URL}/uploads/${req.file.filename}`
      : null;

    const newRoom = await Room.create({
      name,
      description,
      capacity,
      amenities: amenitiesArray, // Store as a proper array
      imageurl: imageUrl,
      available: true,
    });

    res
      .status(200)
      .json({ success: true, message: 'Room added successfully', newRoom });
  } catch (error) {
    console.error('Error adding room:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to add room', error: error.message });
  }
});

// 5. Route to filter rooms based on criteria
router.post('/filterRooms', async (req, res) => {
  const {
    fromDate,
    toDate,
    startTime,
    endTime,
    capacity,
    amenities,
    searchKey,
  } = req.body;

  try {
    // Convert dates and times to dayjs objects
    const selectedStartTime = dayjs(`${fromDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const selectedEndTime = dayjs(`${toDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

    if (!selectedStartTime.isValid() || !selectedEndTime.isValid()) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // Build where clause for Room
    const roomWhereClause = {};

    // Capacity Filter
    if (capacity && capacity !== 'all') {
      const capacityRange = capacity.split('-').map(Number);
      if (capacityRange.length === 2) {
        roomWhereClause.capacity = { [Op.between]: capacityRange };
      } else {
        roomWhereClause.capacity = { [Op.gte]: Number(capacity) };
      }
    }

    // Amenities Filter
    if (amenities && amenities.length > 0) {
      roomWhereClause[Op.and] = amenities.map((amenity) =>
        Sequelize.where(
          Sequelize.fn('JSON_CONTAINS', Sequelize.col('amenities'), JSON.stringify(amenity)),
          true
        )
      );
    }

    // Search Key Filter
    if (searchKey) {
      roomWhereClause.name = { [Op.like]: `%${searchKey}%` };
    }

    // Find rooms matching the criteria
    const rooms = await Room.findAll({
      where: roomWhereClause,
    });

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found matching the given criteria' });
    }

    // Check for room availability based on the selected date and time
    const availableRooms = [];

    for (const room of rooms) {
      // Find existing bookings for the room that overlap with the selected date range
      const existingBookings = await Booking.findAll({
        where: {
          roomId: room.id,
          status: { [Op.in]: ['pending', 'finalized'] },
          [Op.or]: [
            {
              fromDate: { [Op.lte]: toDate },
              toDate: { [Op.gte]: fromDate },
            },
          ],
        },
      });

      // Check for time overlaps
      const isRoomAvailable = existingBookings.every((booking) => {
        const bookingStart = dayjs(`${booking.fromDate} ${booking.startTime}`, 'YYYY-MM-DD HH:mm:ss');
        const bookingEnd = dayjs(`${booking.toDate} ${booking.endTime}`, 'YYYY-MM-DD HH:mm:ss');

        // If selected end time is before booking start or selected start time is after booking end, no overlap
        return (
          selectedEndTime.isBefore(bookingStart) || selectedStartTime.isAfter(bookingEnd)
        );
      });

      if (isRoomAvailable) {
        availableRooms.push(room);
      }
    }

    if (availableRooms.length === 0) {
      return res.status(404).json({ message: 'No rooms available based on the selected criteria' });
    }

    res.status(200).json({ success: true, rooms: availableRooms });
  } catch (error) {
    console.error('Error filtering rooms:', error);
    res.status(500).json({ message: 'Error filtering rooms', error: error.message });
  }
});

// 6. Route to delete a room
router.delete('/deleteroom/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByPk(id); // Find room by id
    if (room) {
      await room.destroy(); // Delete room

      res.status(200).json({ success: true, message: 'Room deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ success: false, message: 'Failed to delete room' });
  }
});

// 7. Route to update a room
router.put('/updateroom/:id', async (req, res) => {
  const { name, description, capacity, amenities, imageurl } = req.body;
  const { id } = req.params;

  try {
    const room = await Room.findByPk(id); // Find room by primary key (id)
    if (room) {
      room.name = name;
      room.description = description;
      room.capacity = capacity;
      room.amenities = amenities;
      room.imageurl = imageurl;

      await room.save(); // Save updated room

      res.status(200).json({ success: true, message: 'Room updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ success: false, message: 'Failed to update room' });
  }
});

// 8. Route to get all rooms
router.get('/getallrooms', async (req, res) => {
  try {
    const rooms = await Room.findAll(); // Sequelize method to get all rooms
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error getting all rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to get rooms' });
  }
});

// 9. Route to get room availability
router.get('/availability', async (req, res) => {
  const { fromDate, toDate } = req.query;

  try {
    // Validate dates
    if (!fromDate || !toDate) {
      return res.status(400).json({ success: false, message: 'fromDate and toDate are required' });
    }

    const startDate = dayjs(fromDate).startOf('day');
    const endDate = dayjs(toDate).endOf('day');

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    // Fetch all rooms
    const rooms = await Room.findAll({
      attributes: ['id', 'name', 'capacity', 'amenities'],
    });

    // Fetch bookings within the date range
    const bookings = await Booking.findAll({
      where: {
        status: { [Op.in]: ['finalized', 'pending'] },
        [Op.or]: [
          {
            fromDate: { [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')] },
          },
          {
            toDate: { [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')] },
          },
        ],
      },
      attributes: ['id', 'roomId', 'fromDate', 'toDate', 'startTime', 'endTime', 'status'],
    });

    // Map room availability
    const roomAvailability = rooms.map((room) => {
      // Find bookings for this room
      const roomBookings = bookings.filter((booking) => booking.roomId === room.id);

      return {
        ...room.toJSON(),
        bookings: roomBookings,
      };
    });

    res.status(200).json({ success: true, rooms: roomAvailability });
  } catch (error) {
    console.error('Error fetching room availability:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch room availability' });
  }
});

// 10. Route to get room usage statistics
router.get('/usageStatistics', async (req, res) => {
  try {
    const roomUsage = await Room.findAll({
      attributes: [
        'id',
        'name',
        'capacity',
        [sequelize.fn('COUNT', sequelize.col('Bookings.id')), 'totalBookings'],
        [
          sequelize.fn(
            'SUM',
            sequelize.literal(
              `TIMESTAMPDIFF(HOUR, CONCAT(Bookings.fromDate, " ", Bookings.startTime), CONCAT(Bookings.toDate, " ", Bookings.endTime))`
            )
          ),
          'totalHoursBooked',
        ],
      ],
      include: [
        {
          model: Booking,
          as: 'Bookings',
          attributes: [],
          where: { status: { [Op.in]: ['finalized', 'completed'] } },
          required: false,
        },
      ],
      group: ['Room.id'],
    });

    const formattedRoomUsage = roomUsage.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      totalBookings: parseInt(room.get('totalBookings')) || 0,
      totalHoursBooked: parseFloat(room.get('totalHoursBooked')) || 0,
    }));

    res.status(200).json({ success: true, rooms: formattedRoomUsage });
  } catch (error) {
    console.error('Error fetching room usage statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch room usage statistics' });
  }
});

// 11. Route to get rooms scheduled for future meetings
router.get('/scheduledRooms', async (req, res) => {
  try {
    const currentDateTime = dayjs();

    const scheduledRooms = await Room.findAll({
      include: [
        {
          model: Booking,
          as: 'Bookings', // Specify the alias here
          where: {
            startDateTime: {
              [Op.gt]: currentDateTime.toDate(), // Booking start time is greater than now
            },
          },
        },
      ],
    });

    res.status(200).json(scheduledRooms);
  } catch (error) {
    console.error('Error fetching scheduled rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch scheduled rooms' });
  }
});

// 12. Route to get room details by ID (Dynamic Route - Last)
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  console.log('Fetching room details for ID:', roomId);  // Debugging

  try {
    const room = await Room.findByPk(roomId);

    if (room) {
      res.status(200).json(room);
    } else {
      console.log('Room not found for ID:', roomId);  // Debugging
      res.status(404).json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch room details' });
  }
});

// 13. Route to serve uploaded images (if needed)
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Export the router
module.exports = router;
