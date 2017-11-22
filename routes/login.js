const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.locals.errors = req.flash();
  res.render('login',{message: res.locals.errors.error});
});

router.post('/', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: 'Invalid username or password.'
}), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;
