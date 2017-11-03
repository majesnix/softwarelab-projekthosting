var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('parts/content/project', {
        sidebar: true
    });
});

module.exports = router;
