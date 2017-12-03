const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.locals.message = req.flash();
  res.render('login', {message: res.locals.message});
});

router.post('/', passport.authenticate(/*['ldapauth', */'local'/*]*/, {
  failureRedirect: '/',
  failureFlash: 'Invalid username or password.'
}), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.render('dashboard', {
      user: req.user.user,
      projects: req.user.projects,
      participations: req.user.participations,
    });
  });
});

module.exports = router;
