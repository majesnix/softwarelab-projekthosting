const Sequelize = require('sequelize');

const attributes = {
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

const options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;