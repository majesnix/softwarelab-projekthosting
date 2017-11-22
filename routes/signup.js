const express = require('express');
const router = express.Router();
const signupController = require('../app/controller/signupController');

/* router.get('/', (req, res, next) => {
  res.render('signup');
}); */

router.get('/', signupController.show);
router.post('/', signupController.signup);

module.exports = router;