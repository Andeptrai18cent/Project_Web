const Joi = require('joi');

const registerValidator = (data) => {
    const rule = Joi.object({
        name: Joi.string().min(6).max(225).required(),
        email: Joi.string().min(6).max(225).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
        username: Joi.string().min(6).max(30).required(),
        phone_number: Joi.string().pattern(new RegExp(/(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/)).optional(),
        address: Joi.string().min(6).max(225).optional(),
        repeat_password: Joi.ref('password'),
    }).with('password', 'repeat_password');
    return rule.validate(data)
}

module.exports.registerValidator = registerValidator;