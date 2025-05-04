const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// Sync Sequelize models
sequelize.sync({ force: false })
  .then(() => console.log('Database & tables synced!'))
  .catch(err => console.error('Error syncing database:', err));

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://conference-room-booking.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve uploaded images statically with proper CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/UserRoutes');
const roomRoutes = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const consumableItemRoutes = require('./routes/consumableItem');
const cartRoutes = require('./routes/cart');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingsRouter);
app.use('/api/consumable-items', consumableItemRoutes);
app.use('/api/cart', cartRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
