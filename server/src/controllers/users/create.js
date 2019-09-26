const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');

const api = makeInvoker(
    ({ userService, userSchema, userMapper, httpStatus }) => {
        return {
            index: async (req, res) => {
                let obj = req.body;
                const { error, value } = userSchema.validate(obj);
                if (error) {
                    throw new Error(error);
                }
                try {
                    let user = await userService.create(value);
                    return res
                        .status(httpStatus.CREATED)
                        .send(userMapper.map(user));
                } catch (err) {
                    throw err;
                }
            }
        };
    }
);

router.post('/', auth.optional, api('index'));
module.exports = router;
