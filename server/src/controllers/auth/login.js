const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');
const passport = require('passport');

const api = makeInvoker(({ httpStatus, userMapper }) => {
    return {
        index: async (req, res, next) => {
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ success: false });
                    // return next('User not found');
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.status(httpStatus.OK).send(userMapper.map(user));
                });
            })(req, res, next);
        }
    };
});

router.post('/login', auth.optional, api('index'));
module.exports = router;
