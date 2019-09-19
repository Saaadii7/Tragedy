const debug = require('debug')('server:server');
const http = require('http');

class Server {
    constructor({ app, config, logger }) {
        this.app = app;
        this.config = config;
        this.logger = logger;
        console.log('Server starting on port: ', this.config.web.port);
    }

    start() {
        return new Promise(resolve => {
            const server = http.createServer(this.app);
            server.listen(this.config.web.port, () => {
                // const { port } = http.address();
                server.on('error', onError);
                server.on('listening', onListening);
                this.logger.info(
                    `[p ${process.pid}] Listening at port ${this.config.web.port}`
                );
                resolve();
            });
        });
    }
}

module.exports = Server;

// const app = require('../app');

// let port = webSettings.port;
// console.log('Server starting on port: ', port);
// app.set('port', port);

// const server = http.createServer(app);
// const io = require('socket.io')(server);
// app.set('io', io);
// process.io = io;

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
