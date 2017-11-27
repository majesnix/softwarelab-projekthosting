const Sequelize = require('sequelize');

const attributes = {
  projectid: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  student: {
    type: Sequelize.STRING,
    references: { 
      model: 'users',
      key: 'matrnr',
    }
  },
};

const options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;