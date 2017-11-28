const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  const projects = req.user.projects;
  const activeProject = projects.find(el => el.id == req.query.id);

  res.render('project', {
    user: req.user.user,
    projects: req.user.projects,
    activeProject: activeProject,
    activeID: req.query.id
  });
});

module.exports = router;