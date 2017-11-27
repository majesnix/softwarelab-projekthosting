const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.locals.errors = req.flash();
  res.render('login',{message: res.locals.errors.error});
});

router.post('/', passport.authenticate(/*['ldapauth', */'local'/*]*/, {
  failureRedirect: '/',
  failureFlash: 'Invalid username or password.'
}), (req, res, next) => {
  //console.log('LOGIN SUCCESS');
  req.session.save((err) => {
    if (err) {
      //console.log('ERR TRUE');
      return next(err);
    }
    //console.log('RETURN TO DASHBOARD');
    res.redirect('/dashboard');
  });
});

module.exports = router;
