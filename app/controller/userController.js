const bcrypt = require('bcrypt');
const { User } = require('../models/model.js');
const path = require('path');

module.exports.show = async (req, res) => {
  res.locals.message = req.flash();
  res.render('signup', { message: res.locals.message.error });
};

module.exports.createUser = async (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const password2 = req.body.password2;
  const admin = (req.body.admin === 'on') ? true : false;

  if (!email || !firstname || !lastname || !password || !password2) {
    req.flash('error', 'Please, fill in all the fields.');
    res.redirect('/signup');
  }

  if (password !== password2) {
    req.flash('error', 'Please, enter the same password twice.');
    res.redirect('/signup');
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // create the user in the database
  User.create({matrnr: email.split('@')[0], email: email, firstname: firstname, lastname: lastname, salt: salt, password: hashedPassword, ldap: false, isadmin: admin})
    .then(() => {
      if (req.user.user.isadmin) {
        req.flash('info', 'User successfully created');
        res.redirect('/adminsettings');
      } else {
        res.redirect('/');
      }
    }).catch(() => {
      if (req.user.user.isadmin) {
        req.flash('error', 'This e-mail has already been registered');
        res.redirect('/adminsettings');
      } else {
        req.flash('error', 'This e-mail has already been registered');
        res.redirect('/signup');
      }
    });
};

module.exports.deleteUser = async (req, res) => {
  const id = req.body.matrnr;

  User.findOne({where: { matrnr: id}})
    .then(user => {
      // deletes the database entry
      user.destroy();
      req.flash('info', 'User deleted');
      res.redirect('/adminsettings');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/adminsettings');
    });
};

module.exports.changePassword = async (req, res) => {
  const id = req.user.matrnr;
  const oldPass = req.body.inputoldpassword;
  const newPass = req.body.inputnewpassword;
  const newPass2 = req.body.inputnewpassword2;

  if (newPass !== newPass2) {
    req.flash('error', 'Passwords do not match.');
    res.redirect('/usersettings');
  }

  User.findOne({where: { matrnr: id }})
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
          console.log(err);
          req.flash('error', 'Something went wrong');
          res.redirect('/usersettings');
        });
      }
    });
};

module.exports.changeAvatar = async (req, res) => {
  const id = req.user.user.matrnr;
  // Search for the user
  User.findOne({where: { matrnr: id}})
    .then(user => {
      if (user.avatar.split('.')[0] !== user.matrnr) {
        // Update user entry with correct file name and ending
        const newAvatar = `${id}${path.extname(req.file.originalname).toLowerCase()}`;
        user.update({avatar: newAvatar});
        req.user.user.avatar = newAvatar;
      }
      req.flash('info', 'Avatar changed');
      res.redirect('/usersettings');
    });
  
};