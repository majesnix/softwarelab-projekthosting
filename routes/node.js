const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.render('node', {
    user: require('../user.json'),
    user2: req.session.passport.user.name
  });
});

module.exports = router;