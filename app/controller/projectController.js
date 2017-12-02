const fs = require('fs');
const { Project, ProjectParticipant, Application, Database } = require('../models/model.js');

module.exports.createProject = async (req, res) => {
  //create DB entry in projectdatabase (FK -> Matrikelnummer)
  //create folders for 
  // TODO: check project quota
  const name = req.body.name;
  const matrnr = req.user.user.matrnr;

  Project.create({ userid: matrnr, name: name })
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

  Project.destroy({ where: { id: id }})
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};

module.exports.changeProjectName = async (req, res) => {
  const name = req.body.newname;
  const project = req.body.id;

  Project.update({ name: name },{ where: { id : project } })
    .then(() => {
      req.flash('info', 'Successfully change the project name');
      res.redirect(`/settings?id=${project}`);
    })
    .catch(err => {
      req.flash('error', 'Something went wrong');
      console.error(err);
      res.redirect(`/settings?id=${project}`);
    });
};

module.exports.addParticipant = async (req, res) => {
  const matrnr = req.body.matrnr;
  const project = req.body.id;

  ProjectParticipant.create({ userid: matrnr, projectid: project })
    .then(() => {
      res.redirect(`/settings?id=${project}`);
    });
};

module.exports.createApplication = async (req, res) => {
  //create new entry in application db (FK -> Projectid)
  //create folder for application
  const name = req.body.name;
  const project = req.body.id;
  const type = req.body.type;

  Application.create({ projectid: project, name: name, type: type})
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};

module.exports.deleteApplication = async (req, res) => {
  //delete folder of application
  //delete DB entry
  const id = req.body.id;

  Application.destroy({ where: { id: id } })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};

module.exports.createDatabase = async (req, res) => {
  //identify by database owner? save db owner in user->databases table
  //create new database (FK -> Projectid)
  //query to create database/user/pw -> grant privileges for new created user
  const name = req.body.name;
  const project = req.body.id;
  const type = req.body.type;

  Database.create({ projectid: project, name: name, type: type })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};

module.exports.deleteDatabase = async (req, res) => {
  //delete database
  const id = req.body.id;

  Database.destroy({ where: { id: id } })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.redirect('/dashboard');
    });
};