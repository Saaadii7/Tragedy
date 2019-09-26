const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');

const api = makeInvoker(({ userService, httpStatus }) => {
    return {
        index: async (req, res) => {
            try {
                let result = await userService.delete({ id: req.params.id });
                return res
                    .status(httpStatus.OK)
                    .send({ message: 'Successfully Deleted.' });
            } catch (err) {
                throw err;
            }
        }
    };
});

router.delete('/:id', auth.optional, api('index'));
module.exports = router;
