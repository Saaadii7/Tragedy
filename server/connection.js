const ModelsLoader = require('./src/models/index');
const Sequelize = require('sequelize');
const { db: config } = require('./config');
if (config) {
    const sequelize = new Sequelize(config);
    module.exports = ModelsLoader.load({
        sequelize,
        baseFolder: './src/models'
    });
} else {
    /* eslint-disable no-console */
    console.error('Database configuration not found, disabling database.');
    /* eslint-enable no-console */
}
