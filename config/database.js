// config/database.js

require('dotenv').config();

const { Sequelize } = require('sequelize');

// these four must be set in Render’s “Environment” settings
const {
  MYSQL_DATABASE: DB_NAME,
  MYSQLUSER: DB_USER,
  MYSQL_ROOT_PASSWORD: DB_PASS,
  MYSQLHOST: DB_HOST,
  MYSQLPORT: DB_PORT,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
  throw new Error('Missing one of DB_NAME, DB_USER, DB_PASS or DB_HOST in env');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    // uncomment if your MySQL requires SSL:
    // ssl: { rejectUnauthorized: false }
  },
});

module.exports = sequelize;
