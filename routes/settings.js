const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  const projects = req.user.projects;
  const activeProject = projects.find(el => el.id == req.query.id);

  res.render('settings', {
    user: req.user.user,
    projects: req.user.projects,
    activeProject: activeProject,
  });
});

module.exports = router;