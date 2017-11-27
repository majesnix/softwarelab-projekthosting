const Sequelize = require('sequelize');

const attributes = {
  matrnr: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING
  },
  ldap: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  isadmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: 'default.png',
  }
};

const options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;