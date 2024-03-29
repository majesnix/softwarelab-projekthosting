const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const setupPassport = require('./app/setupPassport');

const rProject = require('./routes/project');
const rLogin = require('./routes/login');
const rDashboard = require('./routes/dashboard');
const rDatabases = require('./routes/databases');
const rGitlab = require('./routes/newService');
const rNode = require('./routes/node');
const rNewService = require('./routes/newService');
const rSettings = require('./routes/settings');
//const rSignUp = require('./routes/signup');
const rUserSettings = require('./routes/usersettings');
const rAdminSettings = require('./routes/adminsettings');
const rApi = require('./routes/api');
const rLogout = require('./routes/logout');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

setupPassport(app);

app.use('/', rLogin);
app.use('/project', rProject);
app.use('/dashboard', rDashboard);
app.use('/gitlab', rGitlab);
app.use('/node', rNode);
app.use('/databases', rDatabases);
app.use('/newservice', rNewService);
app.use('/settings', rSettings);
//app.use('/signup', rSignUp);
app.use('/usersettings', rUserSettings);
app.use('/adminsettings', rAdminSettings);
app.use('/api', rApi);
app.use('/logout', rLogout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res/*, next*/) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
