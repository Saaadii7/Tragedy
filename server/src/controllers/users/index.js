const router = require('express').Router();

router.get('/', require('./all'));
router.post('/', require('./create'));
router.get('/:id', require('./get'));

module.exports = router;
