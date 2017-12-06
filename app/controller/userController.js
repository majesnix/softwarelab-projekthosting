const bcrypt = require('bcrypt');
const { User } = require('../models/db');
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
    if (req.user && req.user.user.isadmin) {
      req.flash('error', 'Please, fill in all the fields');
      return res.redirect('/adminsettings');
    } else {
      req.flash('error', 'Please, fill in all the fields');
      return res.redirect('/signup');
    }
  } else

  if (password !== password2) {
    if (req.user && req.user.user.isadmin) {
      req.flash('error', 'Please, enter the same password twice');
      return res.redirect('/adminsettings');
    } else {
      req.flash('error', 'Please, enter the same password twice');
      return res.redirect('/signup');
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // create the user in the database
  try {
    await User.create({matrnr: email.split('@')[0], email: email, firstname: firstname, lastname: lastname, salt: salt, password: hashedPassword, ldap: false, isadmin: admin});
    
    if (req.user && req.user.user.isadmin) {
      req.flash('info', 'User successfully created');
      res.redirect('/adminsettings');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    if (req.user && req.user.user.isadmin) {
      req.flash('error', 'This e-mail has already been registered');
      res.redirect('/adminsettings');
    } else {
      req.flash('error', 'This e-mail has already been registered');
      res.redirect('/signup');
    }
  }
};

module.exports.deactivateUser = async (req, res) => {
  const id = req.body.matrnr;

  try {
    const user = await User.findOne({ where: { matrnr: id} });

    if (!user) {
      req.flash('error', 'User not found');
      res.redirect('/adminsettings');
    } 
    if (user.active === true) {
      await user.update( {active: false} );
      req.flash('info', 'User deactivated');
      res.redirect('/adminsettings');
    } else {
      await user.update( {active: true} );
      req.flash('info', 'User activated');
      res.redirect('/adminsettings');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Status of user could not be changed');
    res.redirect('/adminsettings');
  }
};

module.exports.changePassword = async (req, res) => {
  const id = req.user.user.matrnr;
  const oldPass = req.body.inputoldpassword;
  const newPass = req.body.inputnewpassword;
  const newPass2 = req.body.inputnewpassword2;

  if (newPass !== newPass2) {
    req.flash('error', 'Passwords do not match');
    res.redirect('/usersettings');
  }

  try {
    const user = await User.findOne({ where: { matrnr: id} });
    const oldHash = bcrypt.hashSync(oldPass, user.salt);
    const hashedPassword = bcrypt.hashSync(newPass, user.salt);

    if (oldHash !== user.password) {
      req.flash('error', 'Your old password is not correct');
      res.redirect('/usersettings');
    } else
    if (hashedPassword === user.password) {
      req.flash('error', 'You cannot change your password to the same password');
      res.redirect('/usersettings');
    } else {
      await user.update({password: hashedPassword});
        
      req.flash('info', 'Password successfully changed');
      res.redirect('/usersettings');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Password could not be changed');
    res.redirect('/usersettings');
  }
};

module.exports.changeAvatar = async (req, res) => {
  const id = req.user.user.matrnr;

  try {
    const user = await User.findOne({where: { matrnr: id}});
  
    if (user.avatar.split('.')[0] !== user.matrnr) {
      // Update user entry with correct file name and ending
      const newAvatar = `${id}${path.extname(req.file.originalname).toLowerCase()}`;
    
      await user.update({avatar: newAvatar}); 
      req.user.user.avatar = newAvatar;
    }
    req.flash('info', 'Avatar changed');
    res.redirect('/usersettings'); 
  } catch (err) {
    console.error(err);
  }
};