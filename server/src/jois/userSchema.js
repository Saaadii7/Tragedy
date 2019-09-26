const Joi = require('@hapi/joi');

module.exports = ({}) => {
    const schema = Joi.object({
        first: Joi.string()
            .alphanum()
            .min(2)
            .max(225),
        // .required(),
        last: Joi.string(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] }
        }),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
        dob: Joi.date().max(new Date()),
        nationalId: Joi.string()
            .min(13)
            .max(13),
        phone: Joi.string()
            .min(11)
            .max(11),
        address: Joi.string(),
        city: Joi.string(),
        postalCode: Joi.number()
            .integer()
            .min(999)
            .max(999999),
        province: Joi.string(),
        timezone: Joi.string(),
        country: Joi.string(),
        available: Joi.boolean(),
        approved: Joi.boolean(),
        banned: Joi.boolean(),
        rating: Joi.number()
            .integer()
            .min(0)
            .max(5),
        settings: Joi.object()
    });

    return schema;
};
