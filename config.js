// config.js (create this file)
//module.exports = {
   // SERVER_BASE_URL: 'http://192.168.0.32:5000',
  //};
  
  // config/config.js
require('dotenv').config();               // ensure .env is loaded in dev

module.exports = {
  development: {
    use_env_variable: 'MYSQL_URL',
    dialect: 'mysql',
  },
  test: {
    use_env_variable: 'MYSQL_URL',
    dialect: 'mysql',
  },
  production: {
    use_env_variable: 'MYSQL_URL',
    dialect: 'mysql',
  },
};