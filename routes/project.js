const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  const projects = req.session.passport.user.projects;
  const activeProject = projects.find(el => el.id == req.query.id);

  res.render('project', {
    user: req.session.passport.user,
    activeProject: activeProject,
    activeID: req.query.id
  });
});

module.exports = router;