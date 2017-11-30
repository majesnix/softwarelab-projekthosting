const Sequelize = require('sequelize');

module.exports.attributes = {
  projectid: {
    type: Sequelize.STRING,
    field: 'project_id',
    references: { 
      model: 'projects',
      key: 'id',
    }
  },
  name: {
    type: Sequelize.STRING,
  }
};

module.exports.options = {
  freezeTableName: true
};