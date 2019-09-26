const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');

const api = makeInvoker(
    ({ userService, httpStatus, userMapper, userSchema }) => {
        return {
            index: async (req, res) => {
                let obj = req.body;
                const { error, value } = userSchema.validate(obj);
                if (error) {
                    throw new Error(error);
                }
                return res
                    .status(httpStatus.CREATED)
                    .send(userMapper.map(await userService.create(value)));
            }
        };
    }
);

router.post('/signup', auth.optional, api('index'));
module.exports = router;
