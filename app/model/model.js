const UserMeta = require('./User.js');
const connection = require('../sequelize.js');

const User = connection.define('users', UserMeta.attributes, UserMeta.options);
// you can define relationships here

module.exports.User = User;