const bcrypt = require('bcrypt');
const  Model = require('../model/model.js');

module.exports.show = function (req, res) {
  res.render('signup');
}

module.exports.signup = function (req, res) {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (!email || !password || !password2) {
    res.redirect('/signup');
  }

  if (password !== password2) {
    res.redirect('/signup');
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  //console.log(email);
  //console.log('SALT'+salt);
  //console.log('hash'+hashedPassword);

  //console.log('precreate');
  Model.User.create({email: email, firstname: firstname, lastname: lastname, salt: salt, password: hashedPassword}).then(function () {
    res.redirect('/dashboard');
  }).catch(function (error) {
    res.redirect('/signup');
  })
}