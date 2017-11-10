const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('parts/content/project', {
        sidebar: true
    });
});

module.exports = router;
