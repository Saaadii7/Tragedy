require('dotenv').config();

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const envConfig = require(path.join(__dirname, 'environments', ENV));
const dbConfig = loadDbConfig();
const secret =
    process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';

const session_expiry = process.env.SESSION_EXPIRY;
const config = Object.assign(
    {
        [ENV]: true,
        env: ENV,
        db: dbConfig,
        secret,
        session_expiry
    },
    envConfig
);

module.exports = config;

function loadDbConfig() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    if (fs.existsSync(path.join(__dirname, './database.js'))) {
        return require('./database')[ENV];
    }
}
