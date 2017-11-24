const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('settings', {
      user: require('../user.json')
  });
});

module.exports = router;