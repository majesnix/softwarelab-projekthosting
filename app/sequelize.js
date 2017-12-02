const Sequelize = require('sequelize');
const { dbURL } = require('../config'); 
const sequelize = new Sequelize(dbURL,{logging: false, operatorsAliases: Sequelize.Op});
const UserMeta = require('./models/User');
const ProjectMeta = require('./models/Project');
const ProjectParticipantsMeta = require('./models/ProjectParticipants');


const User = sequelize.define('users', UserMeta.attributes, UserMeta.options);
const Project = sequelize.define('projects', ProjectMeta.attributes, ProjectMeta.options);
const ProjectParticipants = sequelize.define('projectparticipants', ProjectParticipantsMeta.attributes, ProjectParticipantsMeta.options);

// authenticate with the database
sequelize.authenticate()
  .then(() => {
    // check if db exists, otherwise create it
    User.sync()
    .then(() => Project.sync()
    .then(() => ProjectParticipants.sync()
    .then(() => {
    //Project.sync();
    //ProjectParticipants.sync();

      // relations
      User.hasMany(Project, { foreignKey: 'userid' });
      Project.belongsTo(User);
      User.hasMany(ProjectParticipants, { foreignKey: 'users' });
      Project.hasMany(ProjectParticipants, { foreignKey: 'projects' })
    })));

  })
  .catch(err => {
    console.error('Unable to connect to the database: ', err);
  });

module.exports = sequelize;