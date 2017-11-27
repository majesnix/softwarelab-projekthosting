const Sequelize = require('sequelize');
const { dbURL } = require('../config'); 
const sequelize = new Sequelize(dbURL,{logging: false, operatorsAliases: Sequelize.Op});
const UserMeta = require('./models/User.js');

const User = sequelize.define('users', UserMeta.attributes, UserMeta.options);

// authenticate with the database
sequelize.authenticate()
  .then(() => {
    User.sync();
  })
  .catch(err => {
    console.log('Unable to connect to the database: ', err);
  });

module.exports = sequelize;