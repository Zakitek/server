const mongoose = require("mongoose");
const validator = require("validator");

const mealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength:20,
    },
    price: {
        type: Number,
        required: true,
        minlength: 0,
    },
    description: {
        type: String,
        required: true,
        maxlength:50,
    },
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
