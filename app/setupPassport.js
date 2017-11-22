const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Model = require('./model/model.js');

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(username, password, done) {
      Model.User.findOne({
        where: {
          email: username
        }
      }).then(function(user) {
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

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Model.User.findOne({
      where: {
        id: id
      }
    }).then(function(user) {
      if (user == null) {
        done(new Error('Wrong user id.'));
      }
  
      done(null, user);
    });
  });
};