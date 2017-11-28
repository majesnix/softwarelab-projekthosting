const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.render('users', {
    sidebar: true,
    user: req.session.passport.user
  });
});

module.exports = router;