'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            first: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notNull: true, len: [2, 225] }
            },
            last: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { isEmail: true, notNull: true }
            },
            password: DataTypes.STRING,
            dob: {
                type: DataTypes.DATE,
                validate: { isDate: true, isAfter: '1947-08-14' }
            },
            gender: DataTypes.STRING,
            nationalId: {
                type: DataTypes.STRING,
                validate: { len: [13, 13] }
            },
            phone: {
                type: DataTypes.STRING,
                validate: { len: [11, 11] }
            },
            address: DataTypes.STRING,
            city: DataTypes.STRING,
            postalCode: { type: DataTypes.INTEGER, validate: { len: [4, 7] } },
            province: DataTypes.STRING,
            timezone: DataTypes.STRING,
            country: DataTypes.STRING,
            available: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            approved: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            banned: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            rating: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                min: 0,
                max: 5
            },
            previousEmail: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: { isEmail: true }
            },
            lastLogin: DataTypes.DATE,
            settings: { type: DataTypes.JSON, defaultValue: {} },
            deletedAt: {
                type: DataTypes.DATE
            },
            //virtual
            name: {
                type: DataTypes.VIRTUAL,
                get() {
                    return (
                        this.getDataValue('first') +
                        ' ' +
                        this.getDataValue('last')
                    );
                }
            },
            age: {
                type: DataTypes.VIRTUAL,
                get() {
                    const diffTime = Math.abs(
                        new Date() - new Date(this.getDataValue('dob'))
                    );
                    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }
            }
        },
        {
            tableName: 'users',
            timestamps: true,
            paranoid: true,
            privateColumns: ['password'],
            // version: true,
            classMethods: {
                active: async () => {
                    let result = await user.find({
                        where: { deletedAt: null }
                    });
                    if (!result) {
                        return [];
                    }
                    return result;
                }
            },
            hooks: {
                beforeCreate: function(user, options) {
                    user.password = crypto
                        .pbkdf2Sync(
                            user.password,
                            config.web.secret,
                            10000,
                            512,
                            'sha512'
                        )
                        .toString('hex');
                    return user;
                }
            }
        }
    );
    //associations
    user.associate = function(models) {
        // associations can be defined here
    };
    //class methods
    user.byId = async id => {
        return await user.findOne({
            where: { id: id }
        });
    };

    //instance methods
    user.prototype.generateJWT = function() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + config.web.session_expiry);
        return jwt.sign(
            {
                email: this.email,
                id: this.id,
                exp: parseInt(expirationDate.getTime() / 1000, 10)
            },
            config.web.secret
        );
    };
    user.prototype.toAuthJSON = function() {
        return {
            id: this.id,
            email: this.email,
            token: this.generateJWT()
        };
    };
    user.prototype.authenticate = async function(password) {
        const hash = crypto
            .pbkdf2Sync(password, config.web.secret, 10000, 512, 'sha512')
            .toString('hex');
        return this.password === hash;
    };
    return user;
};
