const {
    asClass,
    asValue,
    asFunction,
    createContainer,
    Lifetime
} = require('awilix');
const { scopePerRequest } = require('awilix-express');
const httpStatus = require('http-status');

const config = require('./config');
const app = require('./app');
const server = require('./bin/www');
const router = require('./src/controllers/index');
const io = require('./utils/socket-io');

const { database, ...models } = require('./connection');

const logger = require('./utils/logger/logger');
const loggerMiddleware = require('./utils/logger/middleware');
const swaggerMiddleware = require('./utils/swagger/middleware');

const prodErrorHandler = require('./utils/errorHandlers/prod');
const devErrorHandler = require('./utils/errorHandlers/dev');

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
        httpStatus: asValue(httpStatus),
        db: asValue(database),
        containerMiddleware: asValue(scopePerRequest(container)),
        swaggerMiddleware: asValue([swaggerMiddleware]),
        errorHandler: asValue(
            config.production ? prodErrorHandler : devErrorHandler
        )
    })
    .loadModules(
        [
            ['src/services/*.js', { register: asClass }, Lifetime.SCOPED],
            ['src/mappers/*.js', { register: asClass }, Lifetime.SCOPED]
        ],
        {
            // we want `TodosService` to be registered as `todosService`.
            formatName: 'camelCase'
        }
    );
// console.log(container);

// console.log(Object.keys(container.registrations));
// container.loadModules(['services/*.js', 'repositories/*.js', 'db/db.js'])
module.exports = container;
