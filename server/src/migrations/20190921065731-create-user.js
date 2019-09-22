'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                primaryKey: true,
                defaultValue: Sequelize.UUIDv4,
                type: Sequelize.UUID
            },
            first: {
                type: Sequelize.STRING,
                allowNull: false
            },
            last: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dob: {
                type: Sequelize.DATE
            },
            nationalId: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            postalCode: {
                type: Sequelize.INTEGER
            },
            province: {
                type: Sequelize.STRING
            },
            timezone: {
                type: Sequelize.STRING
            },
            country: Sequelize.STRING,
            available: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            approved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            banned: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            rating: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                min: 0,
                max: 5
            },
            previousEmail: {
                type: Sequelize.STRING,
                allowNull: true
            },
            lastLogin: Sequelize.DATE,
            settings: { type: Sequelize.JSON, defaultValue: {} },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};
