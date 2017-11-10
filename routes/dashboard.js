const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  console.log(require('../user.json'));
  res.render('dashboard', {
    sidebar: true,
    user: require('../user.json')
  });
});

module.exports = router;