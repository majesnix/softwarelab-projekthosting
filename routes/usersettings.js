const express = require('express');
const router = express.Router();
const signupController = require('../app/controller/signupController');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.errors = req.flash();
  res.render('usersettings', {
    sidebar: true,
    user: require('../user.json'),
    user2: req.session.passport.user,
    message: res.locals.errors.error || res.locals.errors.info
  });
});

router.post('/', signupController.changePassword);

module.exports = router;