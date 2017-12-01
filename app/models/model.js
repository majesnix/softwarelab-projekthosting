const UserMeta = require('./User');
const ProjectMeta = require('./Project');
const ProjectParticipantsMeta = require('./ProjectParticipants');
const connection = require('../sequelize');

module.exports.User = connection.define('users', UserMeta.attributes, UserMeta.options);

module.exports.Project = connection.define('projects', ProjectMeta.attributes, ProjectMeta.options);

module.exports.ProjectParticipant = connection.define('projectparticipants', ProjectParticipantsMeta.attributes, ProjectParticipantsMeta.options);