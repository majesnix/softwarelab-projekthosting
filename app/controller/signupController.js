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

module.exports.changePassword = async (req, res) => {
  const oldPass = req.body.inputoldpassword;
  const newPass = req.body.inputnewpassword;
  const newPass2 = req.body.inputnewpassword2;

  if (newPass !== newPass2) {
    req.flash('error', 'Passwords do not match.');
    res.redirect('/usersettings');
  }

  Model.User.findOne({where: { id: req.session.passport.user.id }})
    .then(data => {
      const oldHash = bcrypt.hashSync(oldPass, data.salt);
      const hashedPassword = bcrypt.hashSync(newPass, data.salt);

      if (oldHash !== data.password) {
        req.flash('error', 'Your old password is not correct');
        res.redirect('/usersettings');
      } else
      if (hashedPassword === data.password) {
        req.flash('error', 'You cannot change your password to the same password.');
        res.redirect('/usersettings');
      } else {
        data.update({password: hashedPassword}).then(() => {
          req.flash('info', 'Password successfully changed');
          res.redirect('/usersettings');
        }
        ).catch(err => {
          req.flash('error', 'Something went wrong');
          res.redirect('/usersettings');
        });
      }
    });
  
};