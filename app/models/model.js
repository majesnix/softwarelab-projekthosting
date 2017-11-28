const UserMeta = require('./User');
const ProjectMeta = require('./Project');
const connection = require('../sequelize');

const User = connection.define('users', UserMeta.attributes, UserMeta.options);
const Project = connection.define('projects', ProjectMeta.attributes, ProjectMeta.options);

module.exports.User = User;
module.exports.Project = Project;