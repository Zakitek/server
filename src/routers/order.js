const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middleware/auth");

// add new order
router.post("/owner-order", auth, async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            owner: req.user._id,
            date: new Date(),
        });

        await order.save();
        res.status(201).json("order submited");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        const orders = await Order.find({ owner: req.user._id });
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Display all orders - add auth (admin) later

router.get("/all-orders", async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/anonym-order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json("order submited");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//display orders for users

/* router.get("/profile/orders", auth, (req, res) => {});
 */

module.exports = router;
