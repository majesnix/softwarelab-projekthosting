const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.errors = req.flash();
  res.render('adminsettings', {
    user: require('../user.json'),
    user2: req.session.passport.user,
    message: res.locals.errors.error || res.locals.errors.info
  });
});

router.post('/delete', userController.delete);
router.post('/create', userController.create);

module.exports = router;