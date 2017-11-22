const bcrypt = require('bcrypt');
const Model = require('../model/model.js');

module.exports.show = (req, res) => {
  res.locals.errors = req.flash();
  res.render('signup', { message: res.locals.errors.error });
};

module.exports.signup = (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (!email || !password || !password2) {
    req.flash('error', 'Please, fill in all the fields.');
    res.redirect('/signup');
  }

  if (password !== password2) {
    req.flash('error', 'Please, enter the same password twice.');
    res.redirect('/signup');
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  Model.User.create({email: email, firstname: firstname, lastname: lastname, salt: salt, password: hashedPassword}).then(() => {
    res.redirect('/');
  }).catch(error => {
    req.flash('error', 'This e-mail already has been registered');
    res.redirect('/signup');
  });
};