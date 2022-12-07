const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema({
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    phone: {
        type: String,
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
        min: 10,
    },
    orders: [
        {
            meal: {
                type: String,
                required: true,
            },
            price: { type: String, required: true },
            quantity: { type: String, required: true },
        },
    ],
    total: {
        type: String,
        required: true,
    },
    date: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
