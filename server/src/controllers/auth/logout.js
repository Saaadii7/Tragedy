const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');

const api = makeInvoker(({ userService, httpStatus, userMapper }) => {
    return {
        index: async (req, res) => {
            if (!req.user) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: 'User already logged out' });
            }
            let result = await userService.update(
                { available: false },
                { id: req.user.id }
            );
            req.logout();
            return res
                .status(httpStatus.OK)
                .send({ message: 'User logged out successfully' });
        }
    };
});

router.get('/logout', auth.optional, api('index'));
module.exports = router;
