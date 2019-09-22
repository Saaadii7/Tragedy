const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../auth');

const api = makeInvoker(({ userService, httpStatus, userMapper }) => {
    return {
        index: async (req, res) => {
            let id = req.params.id;
            let user = await userService.find(id);
            if (!user) {
                throw new Error('User not found.');
            }
            return res.status(httpStatus.OK).send(userMapper.map(user));
        }
    };
});

router.get('/:id', auth.optional, api('index'));
module.exports = router;
