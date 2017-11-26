const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.errors = req.flash();
  res.render('usersettings', {
    sidebar: true,
    user: require('../user.json'),
    user2: req.session.passport.user.name,
    message: res.locals.errors.error || res.locals.errors.info
  });
});

router.post('/', userController.changePassword);

module.exports = router;