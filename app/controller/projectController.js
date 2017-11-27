const fs = require('fs');

module.exports.createProject = async (req, res) => {
  //create DB entry in projectdatabase (FK -> Matrikelnummer)
  //create folders for project
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
  //create new database (FK -> projectid)
};
module.exports.deleteDatabase = async (req, res) => {
  //delete database
};