module.exports = {
    development: {
        username: '',
        password: null,
        database: '',
        host: '127.0.0.1',
        dialect: 'postgres'
    },
    test: {
        username: '',
        password: null,
        database: '',
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: null
    },
    production: process.env.DATABASE_URL
};
