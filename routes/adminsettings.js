const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.message = req.flash();
  res.render('adminsettings', {
    user: req.user.user,
    projects: req.user.projects,
    message: res.locals.message.error || res.locals.message.info
  });
});

module.exports = router;