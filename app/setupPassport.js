const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth').Strategy;
const config = require('../config');

const bcrypt = require('bcrypt');
const Model = require('./models/model.js');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (username, password, done) => {
    // try to find the user
    Model.User.findOne({
      where: {
        email: username
      }
    })
      .then(user => {
        // if no user was found, return error
        if (!user || user.ldap) {
          return done(null, false, { message: 'Incorrect credentials.' });
        }
    
        const hashedPassword = bcrypt.hashSync(password, user.salt);
    
        // when passwords match, return user
        if (user.password === hashedPassword) {
          return done(null, user);
        }
      
        // return false when passwords dont match
        return done(null, false, { message: 'Incorrect credentials.' });
      })
      .catch(err => console.log(err));
  }));

  passport.use(new LdapStrategy({
    usernameField: 'email',
    server: {
      url: config.url,
      bindDn: config.bindDn,
      bindCredentials: config.bindCredentials,
      searchBase: config.searchBase,
      searchFilter: config.searchFilter,
    }
  },
  (user, done) => {
    // Try to create a DB Entry
    Model.User.create({ matrnr: user.userPrincipalName.split('@')[0], email: user.userPrincipalName, firstname: user.givenName, lastname: user.sn, salt: '', password: '' })
      .then(() => {
        // afterwards retriev this entry.
        Model.User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } }).then(user => {
          return done(null, user);
        });
      })
      .catch(err => {
        // If entry already exists, get that entry
        if (err.name === 'SequelizeUniqueConstraintError') {
          Model.User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } }).then(user => {
            return done(null, user);
          });
        } else {
          console.log(err);
        }
      });
  }));

  // Defines which data will be kept in the session
  passport.serializeUser((user, done) => {
    const data = {
      'matrnr': user.matrnr,
      'name': user.firstname,
      'avatar': user.avatar,
      'ldap': user.ldap,
      'isAdmin': user.isadmin
    };
    done(null, data);
  });

  // Gets all data from the stored User
  passport.deserializeUser((user, done) => {
    Model.User.findOne({
      where: {
        matrnr: user.matrnr
      },
      attributes: ['matrnr','email','firstname','lastname']
    }).then(userdata => {
      return done(null, userdata);
    })
      .catch(err => console.error(err));
  });
};