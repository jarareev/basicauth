const moment = require("moment");
const jwt = require("jsonwebtoken");
const { signupSchema, loginSchema } = require('../middlewares/userSchamaValidation');
const Employee = require('../models/employee')
require('dotenv').config()

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

exports.signup = async (req, res, next) => {
    try {
        const result = await signupSchema.validateAsync(req.body, options);

        const doesExist = await Employee.find({ email: result.email })

        if (doesExist.length > 0) {
            throw new Error(`${result.email} is already been registered`)
        }

        const employee = new Employee({ ...result, employeeId: `Emp-${Math.floor(Math.random() * 10000)}` });
        const savedUser = await employee.save()

        res.status(201).json(savedUser)

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const result = loginSchema.validate(req.body, options);

        const { email, password } = req.body;
        const employee = await Employee.findOne({ email }).select("+password");


        if (!employee || !(await employee.correctPassword(password, employee.password))) {
            throw new Error(`Invalid User ${email}`)
        }

        const accessTokenExpires = moment().add(60, "minutes");

        const payload = {
            sub: employee.id,
            iat: moment().unix(),
            exp: accessTokenExpires.unix()
        };

        const token = await jwt.sign(payload, process.env.SECRETKEY);
        res.status(200).json({ ...employee._doc, token });
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

exports.dashboard = async (req, res, next) => {
    try{
        res.send("welcome")
    }catch(error){
        next(error)
    }
}