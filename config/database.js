require('dotenv').config();

const { Sequelize } = require('sequelize');

// Use Railway's provided MySQL connection URL
const connectionString = process.env.MYSQL_PUBLIC_URL;

if (!connectionString) {
  throw new Error('Missing MySQL connection string - check Railway environment variables');
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: { // Railway databases require SSL
      rejectUnauthorized: true
    }
  }
});

module.exports = sequelize;