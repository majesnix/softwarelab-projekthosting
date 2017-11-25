const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  const user = require('../user.json');
  const activeProject = user.projects.find(el => el.id === req.query.id);

  res.render('project', {
    user: user,
    user2: req.session.passport.user.name,
    activeProject: activeProject,
    activeID: req.query.id
  });
});

module.exports = router;