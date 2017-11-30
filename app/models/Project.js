const Sequelize = require('sequelize');

module.exports.attributes = {
  user: {
    type: Sequelize.STRING,
    references: { 
      model: 'users',
      key: 'matr_nr',
    }
  },
  name: {
    type: Sequelize.STRING,
  },
  appquota: {
    type: Sequelize.INTEGER,
    field: 'app_quota',
    defaultValue: 0,
  },
  dbquota: {
    type: Sequelize.INTEGER,
    field: 'db_quota',
    defaultValue: 0,
  }
};

module.exports.options = {
  freezeTableName: true
};