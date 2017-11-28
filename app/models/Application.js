const Sequelize = require('sequelize');

const attributes = {
  applicationid: {
    type: Sequelize.STRING,
    field: 'application_id',
    unique: true,
    primaryKey: true,
  },
  projectid: {
    type: Sequelize.STRING,
    field: 'project_id',
    references: { 
      model: 'projects',
      key: 'project_id',
    }
  },
  name: {
    type: Sequelize.STRING,
  },
  participants: {
    type: Sequelize.STRING,
  }
};

const options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;