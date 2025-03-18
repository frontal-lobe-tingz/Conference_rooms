const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('conference_booking', 'Admin', '@Admintrials00', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
