// const jwt = require('express-jwt');
// const jwt = require('jsonwebtoken');
// const secret = require('../../config').secret;
// function getTokenFromHeader(req) {
//     const {
//         headers: { authorization }
//     } = req;

//     if (
//         (authorization && authorization.split(' ')[0] === 'Token') ||
//         (authorization && authorization.split(' ')[0] === 'Bearer')
//     ) {
//         return authorization.split(' ')[1];
//     }
//     return null;
// }

let auth = {
    required: (req, res, next) => {
        if (req && req.user) {
            next();
        } else {
            throw new Error('Unauthorized User.');
        }
    },
    optional: (req, res, next) => {
        next();
    }
};
// jwt({
//     secret: secret,
//     userProperty: 'payload',
//     credentialsRequired: false,
//     getToken: getTokenFromHeader
// })
module.exports = auth;
