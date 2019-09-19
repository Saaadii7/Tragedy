const { asClass, asValue, asFunction, createContainer } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('./config');
const app = require('./app');
const server = require('./bin/www');
const router = require('./src/controllers/index');
const io = require('./utils/socket-io');

const { models } = require('./src/models');
const logger = require('./utils/logger/logger');
const loggerMiddleware = require('./utils/logger/middleware');

const swaggerMiddleware = require('./utils/swagger/middleware');

const prodErrorHandler = require('./utils/errorHandlers/prod');
const devErrorHandler = require('.//utils/errorHandlers/dev');

const container = createContainer();

container
    .register({
        server: asClass(server).singleton()
    })
    .register({
        app: asFunction(app).singleton(),
        router: asFunction(router).singleton(),
        io: asFunction(io).singleton(),
        logger: asFunction(logger).singleton(),
        loggerMiddleware: asFunction(loggerMiddleware).singleton()
    })
    .register({
        config: asValue(config),
        models: asValue(models),
        containerMiddleware: asValue(scopePerRequest(container)),
        swaggerMiddleware: asValue([swaggerMiddleware]),
        errorHandler: asValue(
            config.production ? prodErrorHandler : devErrorHandler
        )
    });
// container.loadModules(['services/*.js', 'repositories/*.js', 'db/db.js'])
module.exports = container;
