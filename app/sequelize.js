const Sequelize = require('sequelize');
const { dbURL } = require('../config'); 
const sequelize = new Sequelize(dbURL,{logging: false, operatorsAliases: Sequelize.Op});
const UserMeta = require('./models/User');
const ProjectMeta = require('./models/Project');

const User = sequelize.define('users', UserMeta.attributes, UserMeta.options);
const Project = sequelize.define('projects', ProjectMeta.attributes, ProjectMeta.options);

// authenticate with the database
sequelize.authenticate()
  .then(() => {
    User.sync();
    Project.sync();
    User.hasMany(Project, {foreignKey: 'student'});
  })
  .catch(err => {
    console.log('Unable to connect to the database: ', err);
  });

module.exports = sequelize;