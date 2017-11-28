const fs = require('fs');
const Model = require('../models/model.js');

module.exports.createProject = async (req, res, done) => {
  //create DB entry in projectdatabase (FK -> Matrikelnummer)
  //create folders for project
  const name = req.body.name;
  const id = req.session.passport.user.matrnr;

  Model.Project.create({ student: id, name:name })
    .then(() => {
      Model.Project.findAll({ where: {student: id }})
        .then(projects => {
          req.session.passport.user.projects = projects;
          req.session.save();
        });
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};

module.exports.deleteProject = async (req, res) => {
  //delete folders of the project
  //delete DB entry
};

module.exports.createApplication = async (req, res) => {
  //create new entry in application db (FK -> Projectid)
  //create folder for application
};

module.exports.deleteApplication = async (req, res) => {
  //delete folder of application
  //delete DB entry
};

module.exports.createDatabase = async (req, res) => {
  //identify by database owner? save db owner in user->databases table
  //create new database (FK -> Projectid)
};

module.exports.deleteDatabase = async (req, res) => {
  //delete database
};