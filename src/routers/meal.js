const express = require("express");
const router = express.Router();
const Meal = require("../models/meal");
const auth = require("../middleware/auth");

/* const meals = [
    {
        desc: "Finnest fish and veggies",
        id: 1,
        price: "22.99",
        title: "sushi",
    },
    {
        desc: "a german specialty",
        id: 2,
        price: "16.5",
        title: "Schnitzel",
    },
    {
        desc: "American, raw, meaty",
        id: 3,
        price: "12.99",
        title: "Berbecue Burger",
    },
    {
        desc: "Healthy.. and green",
        id: 4,
        price: "18.99",
        title: "Green Bowl",
    },
    {
        desc: "Maticha & bassla",
        id: 5,
        price: "18.99",
        title: "Salade marocaine",
    },
    {
        desc: "Not Healthy",
        id: 6,
        price: "18.99",
        title: "Kafta",
    },
    {
        desc: "get it for free if you don't have money.",
        id: 7,
        price: 0.99,
        title: "Maticha & bid",
    },
];
 */
// display meals

router.get("/meals", async (req, res) => {
    const meals = await Meal.find({});
    try {
        res.status(200).send(meals);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// add new meal
router.post("/add-meal", async (req, res) => {
    console.log(req.body);
    try {
        const meal = new Meal(req.body);
        await meal.save();
        res.status(201).json("meal submited");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// remove meal
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Meal.findByIdAndDelete(id);
        res.status(200).send("meal removed");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// edit meal
router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const meal = await Meal.findByIdAndUpdate(id, req.body);
        if (meal && id && req.body !== {}) {
            return res.status(200).json({ data: "meal updated" });
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
