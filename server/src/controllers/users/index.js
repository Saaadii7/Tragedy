const router = require('express').Router();

router
    .get('/', require('./all'))
    .post('/', require('./create'))
    .get('/:id', require('./get'))
    .put('/:id', require('./update'))
    .delete('/:id', require('./delete'));

module.exports = router;
