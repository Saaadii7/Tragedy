const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const { asValue } = require('awilix');
const { partialRight } = require('ramda');
const auth = require('./verifyToken');

module.exports = ({
    logger,
    config,
    containerMiddleware,
    loggerMiddleware,
    errorHandler,
    swaggerMiddleware,
    httpStatus
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
        next();
    });

    router.get('/', async (req, res) => {
        return res.status(httpStatus.OK).json('🤘 Hello SaaaDiiI 🤘');
    });

    router.get('/health', async (req, res) => {
        return res.sendStatus(httpStatus.OK);
    });

    let registerUser = function(req, res, next) {
        req.container.register({
            user: asValue(req.payload) // from some authentication middleware...
        });
        next();
    };

    router.use('/auth', auth.optional, registerUser, require('./auth'));
    router.use('/users', auth.required, registerUser, require('./users'));

    router.use(errorHandler);

    router.use(['*'], async (req, res) => {
        return res.status(httpStatus.NOT_FOUND).json({
            message: `Requested Route not found ${req.path}`
        });
    });

    return router;
};
