'use strict';
var bcrypt = require('bcrypt');
var saltRounds = 16;

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
                validate: { notNull: true }
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
            }
        },
        {
            tableName: 'users',
            timestamps: true,
            paranoid: true,
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
                    return bcrypt
                        .hash(user.password, saltRounds)
                        .then(function(hash) {
                            user.password = hash;
                        })
                        .catch(function(err) {
                            throw new Error(err);
                        });
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
    user.prototype.name = function() {
        return [this.first, this.last].join(' ');
    };
    user.prototype.authenticate = function(password) {
        return bcrypt.compare(password, this.password);
    };
    return user;
};
