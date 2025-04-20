// config/database.js
require('dotenv').config();                // 1) pull in your local .env when running locally
const { Sequelize } = require('sequelize');

// 2) grab the full URL that Railway injects for you
const connectionString = process.env.MYSQL_URL;
if (!connectionString) {
  throw new Error('Missing env var: MYSQL_URL');
}

// 3) let Sequelize parse user/pass/host/port/dbname from the URL
const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: false,
  // if you ever need SSL:
  // dialectOptions: { ssl: { rejectUnauthorized: true } },
});

module.exports = sequelize;
