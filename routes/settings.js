const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.render('settings', {
    user: require('../user.json')
  });
});

module.exports = router;