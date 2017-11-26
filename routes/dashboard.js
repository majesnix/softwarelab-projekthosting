const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: require('../user.json'),
    user2: req.session.passport.user
  });
});

module.exports = router;