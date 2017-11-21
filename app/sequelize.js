const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://webentwicklung:webentwicklung@localhost:5432/webentwicklung',{logging: false, operatorsAliases: Sequelize.Op});
const UserMeta = require('./model/User.js');

const User = sequelize.define('users', UserMeta.attributes, UserMeta.options);

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    User.sync();
  })
  .catch(function(err) {
    console.log('Unable to connect to the database: ', err);
  });

module.exports = sequelize;