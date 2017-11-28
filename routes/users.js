const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.render('users', {
    sidebar: true,
    user: req.user.user,
    projects: req.user.projects,
  });
});

module.exports = router;