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
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
};

module.exports.options = {
    freezeTableName: true
};