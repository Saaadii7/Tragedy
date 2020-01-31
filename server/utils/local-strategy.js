const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport, userService) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                session: true,
                passReqToCallback: false
            },
            async (email, password, done) => {
                let user = await userService.findByQuery({ email }).catch(done);
                if (!user || !(await user.authenticate(password))) {
                    return done(
                        {
                            name: 'Invalid credentials',
                            message: 'Email or Password is incorrect.'
                        },
                        false
                    );
                }
                return done(null, user);
            }
        )
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
