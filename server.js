const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// ================== CORS Configuration ==================
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://conference-room-booking.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware before other middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// ================== Database Setup ==================
sequelize.sync({ force: false })
  .then(() => console.log('Database & tables synced!'))
  .catch(err => console.error('Error syncing database:', err));

// ================== Middleware ==================
app.use(bodyParser.json());
app.use(express.json());

// ================== File Upload Configuration ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Static files with CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================== Routes ==================
const roomRoutes = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const userRoutes = require('./routes/UserRoutes');
const consumableItemRoutes = require('./routes/consumableItem');
const cartRoutes = require('./routes/cart');

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingsRouter);
app.use('/api/rooms', roomRoutes);
app.use('/api/consumable-items', consumableItemRoutes);

// ================== Server Start ==================
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});