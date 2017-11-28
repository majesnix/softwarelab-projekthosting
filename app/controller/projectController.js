const fs = require('fs');
const Model = require('../models/model.js');

module.exports.createProject = async (req, res) => {
  //create DB entry in projectdatabase (FK -> Matrikelnummer)
  //create folders for 
  // TODO: check project quota
  const name = req.body.name;
  const id = req.user.user.matrnr;

  Model.Project.create({ student: id, name:name })
    .then(() => {
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
  const id = req.body.id;
  Model.Project.destroy({ where: { id: id }})
    .then(() => res.redirect('/dashboard'))
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
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