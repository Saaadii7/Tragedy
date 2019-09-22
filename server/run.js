const container = require('./container');

const db = container.resolve('db');
const server = container.resolve('server');
const app = container.resolve('app');

async function preProcess() {
    if (db) {
        await db.authenticate();
    }
}
preProcess();

server.start().catch(error => {
    app.logger.error(error.stack);
    process.exit();
});
