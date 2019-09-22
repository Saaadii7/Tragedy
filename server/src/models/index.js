'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
    load({ sequelize, baseFolder, indexFile = 'index.js' }) {
        const loaded = {};
        fs.readdirSync(baseFolder)
            .filter(file => {
                return (
                    file.indexOf('.') !== 0 &&
                    file !== indexFile &&
                    file.slice(-3) === '.js'
                );
            })
            .forEach(file => {
                // path.join(baseFolder, file)
                const model = sequelize['import'](file);
                const modelName = file.split('.')[0];
                loaded[modelName] = model;
            });
        Object.keys(loaded).forEach(modelName => {
            if (loaded[modelName].associate) {
                loaded[modelName].associate(loaded);
            }
        });

        loaded.database = sequelize;
        return loaded;
    }
};

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const loader = 'modelLoader.js';
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../../config/database.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//     sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//     sequelize = new Sequelize(
//         config.database,
//         config.username,
//         config.password,
//         config
//     );
// }

// fs.readdirSync(__dirname)
//     .filter(file => {
//         return (
//             file.indexOf('.') !== 0 &&
//             file !== basename &&
//             file !== loader &&
//             file.slice(-3) === '.js'
//         );
//     })
//     .forEach(file => {
//         const model = sequelize['import'](path.join(__dirname, file));
//         db[model.name] = model;
//     });

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
