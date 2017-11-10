const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('project', {
    sidebar: true,
    user: require('../user.json'),
    activeID: req.query.id
  });
});

module.exports = router;