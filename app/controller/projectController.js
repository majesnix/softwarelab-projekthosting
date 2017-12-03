const fs = require('fs');
const passwordgen = require('password-generator');
const bcrypt = require('bcrypt');
const { Project, ProjectParticipant, Application, Database } = require('../models/db');

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
      req.flash('info', 'Participant added');
      res.redirect(`/settings?id=${project}`);
    })
    .catch(err => {
      req.flash('error', 'Something went wrong');
      console.error(err);
      res.redirect(`/settings?id=${project}`);
    });
};

module.exports.removeParticipant = async (req, res) => {
  const matrnr = req.body.matrnr;
  const project = req.body.id;

  ProjectParticipant.destroy({ where: { userid: matrnr, projectid: project } })
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
  const port = req.body.port;

  Application.create({ projectid: project, name: name, type: type, port: port, path: '/not/an/actual/path'})
    .then(() => {
      req.flash('info', 'Application created');
      res.redirect(`/project?id=${project}`);
    })
    .catch(err => {
      req.flash('error', 'Something went wrong');
      console.error(err);
      res.redirect(`/project?id=${project}`);
    });
};

module.exports.deleteApplication = async (req, res) => {
  //delete folder of application
  //delete DB entry
  const id = req.body.id;
  const project = req.body.project;

  Application.destroy({ where: { id: id } })
    .then(() => {
      req.flash('info', 'Application deleted');
      res.redirect(`/project?id=${id}`);
    })
    .catch(err => {
      req.flash('error', 'Something went wrong');
      console.error(err);
      res.redirect(`/project?id=${project}`);
    });
};

module.exports.createDatabase = async (req, res) => {
  //identify by database owner? save db owner in user->databases table
  //create new database (FK -> Projectid)
  //query to create database/user/pw -> grant privileges for new created user
  const name = req.body.name;
  const project = req.body.id;
  const type = req.body.type;

  const pw = passwordgen(8, false);
  console.log(pw);
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(pw, salt);

  Database.create({ projectid: project, name: name, username: 'username', password: hashedPassword, salt: salt })
    .then(() => {

      // TODO: create actual database

      req.flash('info', 'Database created');
      res.redirect(`/project?id=${project}`);
    })
    .catch(err => {
      req.flash('error', 'Something went wrong');
      console.error(err);
      res.redirect(`/project?id=${project}`);
    });
};

module.exports.deleteDatabase = async (req, res) => {
  //delete database
  const id = req.body.id;
  const project = req.body.project;

  Database.destroy({ where: { id: id } })
    .then(() => {

      //TODO: delete actual database

      req.flash('info', 'Database deleted');
      res.redirect(`/project?id=${project}`);
    })
    .catch(err => {
      req.flash('error', ' Something went wrong');
      console.error(err);
      res.redirect(`/project?id=${project}`);
    });
};