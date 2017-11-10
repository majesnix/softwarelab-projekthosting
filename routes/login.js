const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', {
      sidebar: false
  });
});

module.exports = router;
