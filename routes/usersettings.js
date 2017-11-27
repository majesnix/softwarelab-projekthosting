const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals = req.flash();
  res.render('usersettings', {
    sidebar: true,
    user: require('../user.json'),
    user2: req.session.passport.user,
    message: res.locals.error || res.locals.info
  });
});

router.post('/', userController.changePassword);

module.exports = router;