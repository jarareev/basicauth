const Joi = require('joi');

const signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    DOB: Joi.string().required(),
    Experience: Joi.string().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
});

module.exports = {
    signupSchema,
    loginSchema,
}