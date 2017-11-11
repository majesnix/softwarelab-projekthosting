const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  let user = require('../user.json');
  let activeProject = user.projects.find(el => el.id === req.query.id);

  res.render('project', {
    user: user,
    activeProject: activeProject,
    activeID: req.query.id
  });
});

module.exports = router;