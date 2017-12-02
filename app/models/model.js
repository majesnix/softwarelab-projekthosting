import { connect } from 'http2';

const UserMeta = require('./User');
const ProjectMeta = require('./Project');
const ProjectParticipantsMeta = require('./ProjectParticipants');
const ApplicationMeta = require('./Application');
const DatabaseMeta = require('./Database');
const connection = require('../sequelize');

module.exports.User = connection.define('users', UserMeta.attributes, UserMeta.options);

module.exports.Project = connection.define('projects', ProjectMeta.attributes, ProjectMeta.options);

module.exports.ProjectParticipant = connection.define('projectparticipants', ProjectParticipantsMeta.attributes, ProjectParticipantsMeta.options);

module.exports.Application = connect.define('applications', ApplicationMeta.attributes, ApplicationMeta.options);

module.exports.Database = connect.define('databases', DatabaseMeta.attributes, DatabaseMeta.options);