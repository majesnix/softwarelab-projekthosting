const express = require('express');
const router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.message = req.flash();
  const projects = req.user.projects;
  const participations = req.user.participations;
  const activeProject = projects.find(el => el.id == req.query.id) || participations.find(el => el.id == req.query.id);

  res.render('settings', {
    user: req.user.user,
    projects: req.user.projects,
    participations: participations,
    message: res.locals.message.error || res.locals.message.info,
    activeProject: activeProject,
  });
});

module.exports = router;