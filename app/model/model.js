const UserMeta = require('./User.js');
const connection = require('../sequelize.js');

const User = connection.define('users', UserMeta.attributes, UserMeta.options);

module.exports.User = User;