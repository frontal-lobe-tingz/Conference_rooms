const express = require('express');
const cors = require('cors');
const app = express();
//const sequelize = require('./config/database');
const bodyParser = require('body-parser');
require('dotenv').config();

const multer = require('multer');
const path = require('path');
const { sequelize } = require('./models');

sequelize.sync({ force: false }) // set force to true only if you want to recreate tables
  .then(() => {
    console.log('Database & tables synced!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

  
  app.use(bodyParser.json());

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory to store images
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique name for the file
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Serve the uploaded images statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://conference-room-booking.netlify.app' // Your Netlify URL
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON requests

// Import routes
const roomRoutes = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings'); // Ensure path is correct

const userRoutes = require('./routes/UserRoutes');
const consumableItemRoutes = require('./routes/consumableItem');
const cartRoutes = require('./routes/cart');

app.use('/api/users', userRoutes);

app.use('/api/cart', cartRoutes);

// Use routes
app.use('/api/bookings', bookingsRouter);

app.use('/api/rooms', roomRoutes);

app.use('/api/consumable-items', consumableItemRoutes);

// Starting the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
