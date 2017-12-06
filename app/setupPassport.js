const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth').Strategy;
const { url, bindDn, bindCredentials, searchBase, searchFilter } = require('../config');
const Sequelize = require('sequelize');
const { dbURL } = require('../config'); 
const sequelize = new Sequelize(dbURL, { logging: false, operatorsAliases: Sequelize.Op } );

const bcrypt = require('bcrypt');
const { User, Project, Application, Database } = require('./models/db');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LdapStrategy({
    handleErrorsAsFailures: true,
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
    User.create({ matrnr: user.userPrincipalName.split('@')[0], email: user.userPrincipalName, firstname: user.givenName, lastname: user.sn})
      .then(() => {

        // afterwards retriev this entry.
        User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } })
          .then(user => {
            const userinfo = {
              user: user,
              projects: [],
              participations: []
            };
            
            userinfo.projects.dbs = [];
            userinfo.projects.apps = [];
            userinfo.participations.dbs = [];
            userinfo.participations.apps = [];

            return done(null, userinfo);
          });
      })
      .catch(err => {
        // If entry already exists, get that entry
        if (err.name === 'SequelizeUniqueConstraintError') {
          User.findOne({ where: { matrnr: user.userPrincipalName.split('@')[0] } })
            .then(user => {

              Project.findAll({ where: { userid: user.matrnr }})
                .then(projects => {
                  
                  sequelize.query(`SELECT projectparticipants.projectid, projectparticipants.userid, projects.name \
                  FROM projectparticipants \
                  INNER JOIN projects ON projects.id=projectparticipants.projectid \
                  WHERE projectparticipants.userid = '${user.matrnr}'`)
                    .then(participations => {

                      Application.findAll()
                        .then(apps => {
  
                          Database.findAll()
                            .then(dbs => {
                              const userinfo = {
                                user: user,
                                projects: projects,
                                participations: participations[0]
                              };
  
                              userinfo.projects.map(p => p.dbs = []);
                              userinfo.projects.map(p => p.apps = []);
                              userinfo.participations.map(p => p.dbs = []);
                              userinfo.participations.map(p => p.apps = []);
                            
                              projects.map(p => {
                                const projIndex = projects.indexOf(p);
                                const app = apps.filter(app => p.id === app.projectid);
                                const db = dbs.filter(db => p.id === db.projectid);
                                if (app.length !== 0) {
                                  app.map(a => userinfo.projects[projIndex].apps.push(a));
                                }
                                if (db.length !== 0) {
                                  db.map(d => userinfo.projects[projIndex].dbs.push(d));
                                }
                              });
  
                              participations.map(p => {
                                const projIndex = participations.indexOf(p);
                                const app = apps.filter(app => p.projectid === app.projectid);
                                const db = dbs.filter(db => p.projectid === db.projectid);
                                if (app.length !== 0) {
                                  app.map(a => userinfo.participations[projIndex].apps.push(a));
                                }
                                if (db.length !== 0) {
                                  db.map(d => userinfo.participations[projIndex].dbs.push(d));
                                }
                              });
        
                              return done(null, userinfo);
                            });
                        });
                    })
                    .catch(() => {
                      const userinfo = {
                        user: user,
                        projects: projects,
                        participations: []
                      };
                      return done(null, userinfo);
                    });
                });
            });
        } else {
          console.error(err);
        }
      });
  }));

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (username, password, done) => {
    // try to find the user
    User.findOne({
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
          Project.findAll({ where: { userid: user.matrnr }})
            .then(projects => {

              sequelize.query(`SELECT projectparticipants.projectid, projectparticipants.userid, projects.name \
              FROM projectparticipants \
              INNER JOIN projects ON projects.id=projectparticipants.projectid \
              WHERE projectparticipants.userid = '${user.matrnr}'`)
                .then(participations => {
                  
                  Application.findAll()
                    .then(apps => {
                      Database.findAll()
                        .then(dbs => {
                          
                          const userinfo = {
                            user: user,
                            projects: projects,
                            participations: participations[0]
                          };

                          userinfo.projects.map(p => p.dbs = []);
                          userinfo.projects.map(p => p.apps = []);
                          userinfo.participations.map(p => p.dbs = []);
                          userinfo.participations.map(p => p.apps = []);
                          
                          projects.map(p => {
                            const projIndex = projects.indexOf(p);
                            const app = apps.filter(app => p.id === app.projectid);
                            const db = dbs.filter(db => p.id === db.projectid);
                            if (app.length !== 0) {
                              app.map(a => userinfo.projects[projIndex].apps.push(a));
                            }
                            if (db.length !== 0) {
                              db.map(d => userinfo.projects[projIndex].dbs.push(d));
                            }
                          });

                          participations.map(p => {
                            const projIndex = participations.indexOf(p);
                            const app = apps.filter(app => p.projectid === app.id);
                            const db = dbs.filter(db => p.projectid === db.id);
                            if (app.length !== 0) {
                              app.map(a => userinfo.participations[projIndex].apps.push(a));
                            }
                            if (db.length !== 0) {
                              db.map(d => userinfo.participations[projIndex].dbs.push(d));
                            }
                          });
      
                          return done(null, userinfo);
                        });
                    });
                }).catch(err => {
                  console.error(err);
                  const userinfo = {
                    user: user,
                    projects: projects,
                    participations: []
                  };
                  return done(null, userinfo);
                });
            });
        } else {
          // return false when passwords dont match
          return done(null, false, { message: 'Incorrect credentials.' });
        }
      
      })
      .catch(err => console.error(err));
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
    User.findOne({
      where: {
        matrnr: user.matrnr
      }
    }).then(user => {
      
      Project.findAll({ where: { userid: user.matrnr }})
        .then(projects => {
          
          sequelize.query(`SELECT projectparticipants.projectid, projectparticipants.userid, projects.name \
          FROM projectparticipants \
          INNER JOIN projects ON projects.id=projectparticipants.projectid \
          WHERE projectparticipants.userid = '${user.matrnr}'`)
            .then(participations => {
              
              Application.findAll()
                .then(apps => {

                  Database.findAll()
                    .then(dbs => {
                      const userinfo = {
                        user: user,
                        projects: projects,
                        participations: participations[0]
                      };

                      userinfo.projects.map(p => p.dbs = []);
                      userinfo.projects.map(p => p.apps = []);
                      userinfo.participations.map(p => p.dbs = []);
                      userinfo.participations.map(p => p.apps = []);
                    
                      projects.map(p => {
                        const projIndex = projects.indexOf(p);
                        const app = apps.filter(app => p.id === app.projectid);
                        const db = dbs.filter(db => p.id === db.projectid);
                        if (app.length !== 0) {
                          app.map(a => {
                            userinfo.projects[projIndex].apps.push(a);
                          });
                        }
                        if (db.length !== 0) {
                          db.map(d => {
                            userinfo.projects[projIndex].dbs.push(d);
                          });
                        }
                      });

                      participations.map(p => {
                        try {
                          const projIndex = participations.indexOf(p);
                          if (p[0]) {
                            const app = apps.filter(app => p[0].projectid === app.projectid);
                            const db = dbs.filter(db => p[0].projectid === db.projectid);
                            if (app.length !== 0) {
                              app.map(a => userinfo.participations[projIndex].apps.push(a));
                            }
                            if (db.length !== 0) {
                              db.map(d => userinfo.participations[projIndex].dbs.push(d));
                            }
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      });
                      return done(null, userinfo);
                    });
                });
            })
            .catch(() => {
              const userinfo = {
                user: user,
                projects: projects,
                participations: []
              };
              return done(null, userinfo);
            });
        });
    })
      .catch(err => console.error(err));
  });
};