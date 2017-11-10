const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('databases', {
      sidebar: true
  });
});

module.exports = router;