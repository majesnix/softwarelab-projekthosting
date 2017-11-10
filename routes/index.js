const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    sidebar: true
  });
});

module.exports = router;