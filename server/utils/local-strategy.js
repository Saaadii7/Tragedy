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
                let user = await userService
                    .findByQuery({ email: email })
                    .catch(done);
                if (!user || !user.authenticate(password)) {
                    return done(null, false, {
                        errors: {
                            'email or password': 'is invalid'
                        }
                    });
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
