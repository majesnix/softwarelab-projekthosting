const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth').Strategy;
const config = require('./config');

const bcrypt = require('bcrypt');
const Model = require('./model/model.js');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (username, password, done) => {
    Model.User.findOne({
      where: {
        email: username
      }
    })
    .then(user => {
      if (user == null) {
        return done(null, false, { message: 'Incorrect credentials.' });
      }
    
      const hashedPassword = bcrypt.hashSync(password, user.salt);
    
      if (user.password === hashedPassword) {
        return done(null, user);
      }
    
      return done(null, false, { message: 'Incorrect credentials.' });
    });
  }
  ));

  passport.use(new LdapStrategy({
    usernameField: 'email',
    server: {
      //Can be ldaps (636)
      url: config.url,
      //CN => Administrator USER, OU => Organization Unit, DC => Domain controller
      bindDn: config.bindDn,
      //PASSWORD
      bindCredentials: config.bindCredentials,
      //In which Organization Unit shall we search?
      // TODO: Better understanding of the searchBase
      searchBase: config.searchBase,
      //Search based on this input
      searchFilter: config.searchFilter,
    }
  },
  (user, done) => {
    Model.User.create({ matrnr: user.userPrincipalName.split('@')[0], email: user.userPrincipalName, firstname: user.givenName, lastname: user.sn, salt: '', password: '', ldap: true })
      .then(() => {
        Model.User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } }).then(user => {
          return done(null, user);
        });
      })
      .catch(error => {
        Model.User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } }).then(user => {
          return done(null, user.dataValues);
        });
      });
  }));

  // Defines which data whil be kept in Session
  passport.serializeUser((user, done) => {
    done(null, user.matrnr || user.sAMAccountName);
  });

  // Gets all data from the stored User
  passport.deserializeUser((user, done) => {
    Model.User.findOne({
      where: {
        matrnr: user
      },
      attributes: ['matrnr','email','firstname','lastname']
    }).then(userdata => {
      user = userdata;
      return done(null, user);
    });
  });
};