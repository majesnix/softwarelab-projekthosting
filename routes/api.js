const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../app/controller/userController');
const projectController = require('../app/controller/projectController');

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

router.post('/changepassword', userController.changePassword);
router.post('/changeavatar', upload.single('avatar'), userController.changeAvatar);
router.post('/deleteuser', userController.delete);
router.post('/createuser', userController.create);
router.post('/createproject', projectController.createProject);
router.post('/deleteproject', projectController.deleteProject);

module.exports = router;