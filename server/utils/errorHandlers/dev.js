const httpStatus = require('http-status');

module.exports = (err, req, res, next) => {
    const { logger } = req.container.cradle;
    logger.error(err);
    let errors = {};
    errors[err.name] = errors[err.name] || [];
    errors[err.name].push(err.message);
    if (err && err.errors && err.errors.length > 0) {
        errors = {};
        err.errors.map(errorObj => {
            errors[errorObj.name || errorObj.type] =
                errors[errorObj.name || errorObj.type] || [];
            errors[errorObj.name || errorObj.type].push(errorObj.message);
        });
    }
    delete errors['undefined'];
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errors);
};
