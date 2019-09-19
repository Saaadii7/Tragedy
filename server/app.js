const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const passport = require('passport');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message:
        'Too many accounts created from this IP, please try again after an hour'
});

module.exports = ({ models, logger, router }) => {
    const app = new express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(require('morgan')('dev'));
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.sessionParser = cookieSession({
        name: 'auth-tkt',
        keys: ['key1', 'key2'],
        httpOnly: false,
        maxAge: 6 * 60 * 60 * 1000
    });
    app.use(app.sessionParser);
    app.use(apiLimiter);

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(router);

    if (models && models.options.logging) {
        models.options.logging = logger.info.bind(logger);
    }

    return app;
};
