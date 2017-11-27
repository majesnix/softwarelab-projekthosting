const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../app/controller/userController');

// File upload hanlder
const multer = require('multer');
// where should the file be save and under what name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/vendor/assets');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.session.passport.user.matrnr}${path.extname(file.originalname).toLowerCase()}`);
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
      // TODO: delete old avatar file from the current user
      return cb(null, true);
    }

    req.flash('error', 'Wrong filetype');
    cb(null, false);
  } });

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.message = req.flash();
  res.render('usersettings', {
    sidebar: true,
    user: require('../user.json'),
    user2: req.session.passport.user,
    message: res.locals.message.error || res.locals.message.info
  });
});

router.post('/changepassword', userController.changePassword);
router.post('/changeavatar', upload.single('avatar'), userController.changeAvatar);

module.exports = router;