const _ = require('lodash');

class userMapper {
    constructor({}) {
        this.methods = ['name'];
        this.short = [
            'id',
            'email',
            'dob',
            'phone',
            'city',
            'country',
            'rating',
            'available',
            'settings',
            'createdAt'
        ];
        this.full = [
            'first',
            'last',
            'nationalId',
            'address',
            'postalCode',
            'approved',
            'deletedAt',
            'lastLogin'
        ].concat(this.short);
        this.all = [
            'province',
            'timezone',
            'banned',
            'previousEmail',
            'updatedAt'
        ].concat(this.full);
    }
    copy(obj, keys) {
        let newObj = {};
        keys.map(key => {
            newObj[key] = obj[key];
        });
        this.methods.map(key => {
            newObj[key] = eval(`obj.${key}()`);
        });
        return newObj;
    }
    map(objs, type) {
        type = ['all', 'full', 'short'].includes(type) ? type : 'short';
        objs = objs || {};
        if (objs.constructor && objs.constructor.name == 'Array') {
            return objs.map(obj => {
                return this.copy(obj, eval(`this.${type}`));
                // return _.pick(obj, eval(type));
                // Object.assign(date.JSON(shortMapperAttrs), {});
            });
        } else {
            return this.copy(objs, eval(`this.${type}`));
        }
    }
    mapFull(obj) {
        return this.map(obj, 'full');
    }
    mapAll(obj) {
        return this.map(obj, 'all');
    }
}
module.exports = userMapper;
