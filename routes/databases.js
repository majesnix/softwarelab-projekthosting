const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('databases', {
    user: require('../user.json')
  });
});

module.exports = router;