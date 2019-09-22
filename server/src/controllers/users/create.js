const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../auth');

const api = makeInvoker(({ userService, httpStatus, userMapper }) => {
    return {
        index: async (req, res) => {
            let obj = req.body;
            return res
                .status(httpStatus.CREATED)
                .send(userMapper.map(await userService.create(obj)));
        }
    };
});

router.post('/', auth.optional, api('index'));
module.exports = router;
