const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;
