const Sequelize = require('sequelize');

const attributes = {
  student: {
    type: Sequelize.STRING,
    references: { 
      model: 'users',
      key: 'matr_nr',
    }
  },
  name: {
    type: Sequelize.STRING,
  },
  participants: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: [],
  }
};

const options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;