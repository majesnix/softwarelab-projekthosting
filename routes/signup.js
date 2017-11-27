const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

router.get('/', userController.show);
router.post('/', userController.create);

module.exports = router;