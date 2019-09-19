var router = require('express').Router();
var auth = require('../auth');

router.get('/', auth.optional, function(req, res, next) {
    return res.json([]);
});

module.exports = router;
