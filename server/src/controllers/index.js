const { Router } = require('express');
const httpStatus = require('http-status');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const { asValue } = require('awilix');
const { partialRight } = require('ramda');

module.exports = ({
    logger,
    config,
    containerMiddleware,
    loggerMiddleware,
    errorHandler,
    swaggerMiddleware
}) => {
    const router = Router();
    if (config.env === 'development') {
        router.use(statusMonitor());
    }

    if (config.env !== 'test') {
        router.use(loggerMiddleware);
    }

    router
        .use(methodOverride('X-HTTP-Method-Override'))
        .use(cors())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: false }))
        .use(compression())
        .use(containerMiddleware)
        .use('/docs', swaggerMiddleware);

    router.use(function(req, res, next) {
        req.container.register({
            user: asValue(req.user) // from some authentication middleware...
        });
        return next();
    });

    router.get('/', async (req, res) => {
        return res.json('🤘 Hello SaaaDiiI 🤘');
    });

    router.use('/users', require('./users'));

    router.get(['*'], async (req, res) => {
        let data = {
            code: 400,
            message: `Requested Route not found ${req.path}`
        };
        return res.status(httpStatus.NOT_FOUND).json(data);
    });
    router.use(partialRight(errorHandler, [logger, config]));

    return router;
};
