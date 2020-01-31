const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const passport = require('passport');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

if (!process.env.WHOAMI) {
    console.log(
        'Make a right .env file to go along, This can be a tragedy too. Taking you out!'
    );
    process.exit();
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message:
        'Too many accounts created from this IP, please try again after an hour'
});

module.exports = ({ db, logger, router, passportStrategy, userService }) => {
    const app = new express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(require('morgan')('dev'));
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.disable('x-powered-by');
    app.use(apiLimiter);

    app.use(passport.initialize());
    app.use(passport.session());
    passportStrategy(passport, userService);

    app.use(router);

    if (db && db.options && db.options.logging) {
        // db.options.logging = logger.info.bind(logger);
    }

    return app;
};
