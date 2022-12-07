const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
    try {
        let user_ = await User.findOne({ email: req.body.email });
        if (user_) return res.status(400).send("User already registered.");

        const user = new User({ ...req.body, permission: "customer" });
        const token = await user.generateAuthToken();

        await user.save();
        res.status(201).send({ token, expiresIn: 3600, user });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/signup/admin", async (req, res) => {
    try {
        let user_ = await User.findOne({ email: req.body.email });
        if (user_) return res.status(400).send("User already registered.");

        const user = new User({ ...req.body, permission: "admin" });
        const token = await user.generateAuthToken();

        await user.save();
        res.status(201).send({ token, expiresIn: 3600, user });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();
        res.send({ token, expiresIn: 3600, user });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get("/profile", auth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send("you've successefuly logged out");
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/logoutall", auth, async (req, res) => {
    try {
        console.log(req.user);
        req.user.tokens = [];
        await req.user.save();
        res.send("you've successefuly logged out from all devices");
    } catch (error) {
        res.status(500).send();
    }
});

router.delete("/profile", auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        //or : await req.user.remove()
        res.send("your account has been deleted");
    } catch (error) {
        res.status(500).send();
    }
});

router.patch("/profile", auth, async (req, res) => {
    let user_ = await User.findOne({ email: req.body.email });
    if (user_)
        return res.status(400).send({ error: "Email already registered." });

    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            "fullname",
            "email",
            "phone",
            "password",
            "address",
        ];
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ error: "Invalid updates!" });
        }
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;

/* req.user._doc = { ...req.user._doc, ...req.body }; */
