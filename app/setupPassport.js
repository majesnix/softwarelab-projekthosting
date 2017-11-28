const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth').Strategy;
const { url, bindDn, bindCredentials, searchBase, searchFilter } = require('../config');

const bcrypt = require('bcrypt');
const Model = require('./models/model.js');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LdapStrategy({
    usernameField: 'email',
    server: {
      url: url,
      bindDn: bindDn,
      bindCredentials: bindCredentials,
      searchBase: searchBase,
      searchFilter: searchFilter,
    }
  },
  (user, done) => {
    // Try to create a DB Entry
    Model.User.create({ matrnr: user.userPrincipalName.split('@')[0], email: user.userPrincipalName, firstname: user.givenName, lastname: user.sn})
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
            Model.Project.findAll({ where: {student: user.matrnr }})
              .then(projects => {
                const userinfo = {
                  user: user,
                  projects: projects
                };
                return done(null, userinfo);
              });
            //return done(null, user);
          });
        } else {
          console.log(err);
        }
      });
  }));

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
          //search projects
          Model.Project.findAll({ where: {student: user.matrnr }})
            .then(projects => {
              const userinfo = {
                user: user,
                projects: projects
              };
              return done(null, userinfo);
            });
        } else {
          // return false when passwords dont match
          return done(null, false, { message: 'Incorrect credentials.' });
        }
      
      })
      .catch(err => console.log(err));
  }));

  // Defines which data will be kept in the session
  passport.serializeUser((userinfo, done) => {

    const data = {
      matrnr: userinfo.user.matrnr
    };
    done(null, data);
  });

  // Gets all data from the stored User
  passport.deserializeUser((user, done) => {
    Model.User.findOne({
      where: {
        matrnr: user.matrnr
      }
    }).then(userdata => {
      Model.Project.findAll({ where: {student: userdata.matrnr }})
        .then(projects => {
          const userinfo = {
            user: userdata,
            projects: projects
          };
          return done(null, userinfo);
        });
    })
      .catch(err => console.error(err));
  });
};