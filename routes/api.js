const express = require('express');
const router = express.Router();
const path = require('path');
const { changePassword, changeAvatar, deactivateUser, createUser } = require('../app/controller/userController');
const { createProject, deleteProject, changeProjectName, addParticipant, createApplication, deleteApplication, createDatabase, deleteDatabase } = require('../app/controller/projectController');

// File upload handler
const multer = require('multer');

// where should the file be save and under what name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/vendor/assets');
  },
  filename: (req, file, cb) => {
    // ENHANCEMENT: do not hardcode filextension, but adjust accordingly
    cb(null, `${req.user.user.matrnr}.png`/*${path.extname(file.originalname).toLowerCase()}`*/);
  }
});

// apply storage configuration and add filetype check
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = (/jpe?g|png|bmp/);
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
    if (mimetype && extname) {
      return cb(null, true);
    }

    req.flash('error', 'Wrong filetype');
    cb(null, false);
  } 
});

router.post('/changepassword', require('connect-ensure-login').ensureLoggedIn('/'), changePassword);
router.post('/changeavatar', require('connect-ensure-login').ensureLoggedIn('/'), upload.single('avatar'), changeAvatar);
router.post('/deactivateuser', require('connect-ensure-login').ensureLoggedIn('/'), deactivateUser);
router.post('/createuser', require('connect-ensure-login').ensureLoggedIn('/'), createUser);
router.post('/createproject', require('connect-ensure-login').ensureLoggedIn('/'), createProject);
router.post('/deleteproject', require('connect-ensure-login').ensureLoggedIn('/'), deleteProject);
router.post('/changeprojectname', require('connect-ensure-login').ensureLoggedIn('/'), changeProjectName);
router.post('/addparticipant', require('connect-ensure-login').ensureLoggedIn('/'), addParticipant);
router.post('/createapplication', require('connect-ensure-login').ensureLoggedIn('/'), createApplication);
router.post('/deleteapplication', require('connect-ensure-login').ensureLoggedIn('/'), deleteApplication);
router.post('/createdatabase', require('connect-ensure-login').ensureLoggedIn('/'), createDatabase);
router.post('/deletedatabase', require('connect-ensure-login').ensureLoggedIn('/'), deleteDatabase);

module.exports = router;