const jwt = require('express-jwt');
const config = require('../../config');
function getTokenFromHeaders(req) {
    const {
        headers: { authorization }
    } = req;

    if (
        (authorization && authorization.split(' ')[0] === 'Token') ||
        (authorization && authorization.split(' ')[0] === 'Bearer')
    ) {
        return authorization.split(' ')[1];
    }
    return null;
}

const auth = {
    required: jwt({
        secret: config.web.secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: config.web.secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false
    })
};

module.exports = auth;
