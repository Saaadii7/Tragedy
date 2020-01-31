const path = require('path');
const logPath = path.join(__dirname, '../../logs/test.log');
module.exports = {
    web: {
        port: process.env.SERVER_PORT || '3000',
        secret: process.env.SECRET || 'secret',
        session_expiry: process.env.SESSION_EXPIRY || 300,
        storage_path: process.env.STORAGE_PATH || './uploads'
    },
    logging: {
        appenders: {
            out: { type: 'console' },
            app: { type: 'file', filename: logPath }
        },
        categories: {
            default: { appenders: ['out', 'app'], level: 'debug' }
        }
    }
};
