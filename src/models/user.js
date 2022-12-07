const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    phone: {
        type: String,
        default: 0,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Phone is invalid");
            }
        },
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        /*  validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("choose a stronger password");
            }
        }, */
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    permission: {
        type: String,
        required: true,
    },
});

// this method is called automatically by express when the latter send a response to the client. (the response is stringified)
// JSON.stringify(obj) => return toJSON method only if it exists inside the obj.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_KEY, {
        expiresIn: "1h",
    });
    user.tokens = [{ token }, ...user.tokens];
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
