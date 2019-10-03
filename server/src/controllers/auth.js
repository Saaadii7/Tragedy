const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('./verifyToken');
const passport = require('passport');

const api = makeInvoker(
    ({ userService, httpStatus, userMapper, userSchema }) => {
        return {
            login: async (req, res, next) => {
                passport.authenticate('local', function(err, user, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.status(400).json({ success: false });
                        // return next('User not found');
                    }
                    req.logIn(user, async err => {
                        if (err) {
                            return next(err);
                        }
                        await userService.update(
                            { available: true },
                            { id: req.user.id }
                        );
                        return res
                            .status(httpStatus.OK)
                            .send(userMapper.map(user));
                    });
                })(req, res, next);
            },
            logout: async (req, res) => {
                if (!req.user) {
                    return res
                        .status(httpStatus.OK)
                        .send({ message: 'User already logged out' });
                }
                await userService.update(
                    { available: false },
                    { id: req.user.id }
                );
                req.logout();
                res.clearCookie();
                return res
                    .status(httpStatus.OK)
                    .send({ message: 'User logged out successfully' });
            },
            signup: async (req, res) => {
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

router
    .post('/login', auth.optional, api('login'))
    .get('/logout', auth.optional, api('logout'))
    .post('/signup', auth.optional, api('signup'));

module.exports = router;
