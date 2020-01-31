const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('./verifyToken');
const passport = require('passport');

const api = makeInvoker(
    ({ userService, httpStatus, userMapper, userSchema }) => {
        return {
            login: async (req, res, next) => {
                passport.authenticate(
                    'local',
                    { session: false },
                    async function(err, user) {
                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            return res.status(400).json({
                                success: false,
                                message: 'No User found with these credentials.'
                            });
                        }
                        // req.logIn(user, async err => {
                        if (err) {
                            return next(err);
                        }
                        user.token = user.generateJWT();
                        await userService.update(
                            { available: true },
                            { id: user.id }
                        );
                        return res
                            .status(httpStatus.OK)
                            .send(userMapper.map(user));
                        // });
                    }
                )(req, res, next);
            },
            logout: async (req, res) => {
                await userService.update(
                    { available: false },
                    { id: req.user.id }
                );
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
                return res.status(httpStatus.CREATED).send({
                    message: 'Added Successfully',
                    user: userMapper.map(await userService.create(value))
                });
            }
        };
    }
);

router
    .post('/login', auth.optional, api('login'))
    .get('/logout', auth.optional, api('logout'))
    .post('/signup', auth.optional, api('signup'));

module.exports = router;
