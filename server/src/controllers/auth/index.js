const router = require('express').Router();

router.post('/signup', require('./signup'));
router.post('/login', require('./login'));
router.get('/logout', require('./logout'));

module.exports = router;
