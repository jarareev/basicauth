const mongoose = require('mongoose');
const { roles } = require("../config/roles");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        employeeId: {
            type: String,
        },
        username: {
            type: String,
        },
        password: {
            type: String,
        },
        DOB: {
            type: String
        },
        Experience: {
            type: String
        },
        Role: {
            type: String,
            enum: roles,
            default: "admin",
        }
    },
    {
        collection: 'employee'
    }
)

employeeSchema.methods.correctPassword = async function (
    typedPassword,
    originalPassword
) {
    return await bcrypt.compare(typedPassword, originalPassword);
};

employeeSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 12);
    }
    next();
});

module.exports = mongoose.model('employee', employeeSchema);