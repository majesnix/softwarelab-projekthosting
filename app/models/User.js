const Sequelize = require('sequelize');

const attributes = {
  matrnr: {
    type: Sequelize.STRING,
    field: 'matr_nr',
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
    field: 'first_name',
  },
  lastname: {
    type: Sequelize.STRING,
    field: 'last_name',
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
    field: 'is_admin',
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