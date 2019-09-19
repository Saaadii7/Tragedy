const container = require('./container');

const models = container.resolve('models');
const server = container.resolve('server');
const app = container.resolve('app');

async function preProcess() {
    if (models) {
        await models.authenticate();
    }
}
preProcess();

server.start().catch(error => {
    app.logger.error(error.stack);
    process.exit();
});
