const { makeInvoker } = require('awilix-express');
const router = require('express').Router();
const auth = require('../verifyToken');
const waterfall = require('async-waterfall');

const api = makeInvoker(({ userService, httpStatus, userMapper }) => {
    return {
        index: async (req, res) => {
            let id = req.params.id;
            try {
                let user = await userService.findById(id);
                if (!user) {
                    throw new Error('User not found.');
                }
                return res.status(httpStatus.OK).send(userMapper.map(user));
            } catch (err) {
                throw err;
            }
        }
    };
});

router.get('/:id', auth.optional, api('index'));
module.exports = router;
