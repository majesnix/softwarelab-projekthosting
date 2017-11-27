const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/'), (req, res, next) => {
  res.locals.message = req.flash();
  res.render('adminsettings', {
    user: require('../user.json'),
    user2: req.session.passport.user,
    message: res.locals.message.error || res.locals.message.info
  });
});

router.post('/delete', userController.delete);
router.post('/create', userController.create);

module.exports = router;