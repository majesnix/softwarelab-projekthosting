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
      url: 'ldap://s1.classennetwork.com:389',
      //CN => Administrator USER, OU => Organization Unit, DC => Domain controller
      bindDn: 'cn=Administrator,ou=Administratoren,dc=classennetwork,dc=com',
      //PASSWORD
      bindCredentials: 'SECRET',
      //In which Organization Unit shall we search?
      // TODO: Better understanding of the searchBase
      searchBase: 'ou=Administratoren,dc=classennetwork,dc=com',
      //Search based on this input
      searchFilter: '(userPrincipalName={{username}})',
    }
  },
  (user, done) => {
    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    //console.log('deserelize');
    Model.User.findOne({
      where: {
        matrnr: user.matrnr || user.sAMAccountName
      },
      attributes: ['matrnr','email','firstname','lastname']
    }).then(userdata => {
      //console.log(userdata);
      if (userdata == null) {
        Model.User.create({ matrnr: user.userPrincipalName.split('@')[0], email: user.userPrincipalName, firstname: user.givenName, lastname: user.sn, salt: '', password: '', ldap: true })
        .then(() => {
          
        })
        .catch(error => {
          //req.flash('error', 'This e-mail already has been registered');
          //res.redirect('/signup');
        });
      }
  
      done(null, user);
    });
  });
};