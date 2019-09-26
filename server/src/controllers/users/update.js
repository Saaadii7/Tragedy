const { makeInvoker } = require('awilix-express');
const router = require('express').Router();
const auth = require('../verifyToken');

const api = makeInvoker(
    ({ userService, httpStatus, userSchema, userMapper }) => {
        return {
            index: async (req, res) => {
                let obj = req.body;
                const { error, value } = userSchema.validate(obj);
                if (error) {
                    throw new Error('Data provided is not right.');
                }
                try {
                    let user = await userService.update(value, {
                        id: req.params.id
                    });
                    return res.status(httpStatus.OK).send(userMapper.map(user));
                } catch (err) {
                    throw err;
                }
            }
        };
    }
);

router.put('/:id', auth.optional, api('index'));
module.exports = router;
