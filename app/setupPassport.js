const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth').Strategy;

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
    }).then(user => {
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

  const OPTS = {
    server: {
      url: 'ldap://s1.classennetwork.com:389',
      bindDn: 'Administrator',
      bindCredentials: 'nAja6UpyBuster2007',
      searchFilter: '(sAMAccountName={{username}})'
    },
    usernameField: 'email',
  };

  passport.use(new LdapStrategy(OPTS));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    Model.User.findOne({
      where: {
        id: user.id
      },
      attributes: ['id','email','firstname','lastname']
    }).then(user => {
      if (user == null) {
        done(new Error('Wrong user id.'));
      }
  
      done(null, user);
    });
  });
};