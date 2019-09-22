const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../auth');

// router.get('/', auth.optional, function(req, res, next) {
//     return res.json([]);
// });

const api = makeInvoker(({ userService, httpStatus, userMapper }) => {
    return {
        index: async (req, res) => {
            let users = await userService.all();
            return res
                .status(httpStatus.CREATED)
                .send(userMapper.mapAll(await userService.all()));
        }
    };
});

router.get('/', auth.optional, api('index'));
module.exports = router;
