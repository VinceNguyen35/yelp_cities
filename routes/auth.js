const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Sign Up - New Route
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Sign Up - Create Route
router.post("/signup", async (req, res) => {
    try {
        const newUser = await User.register(new User({
            username: req.body.username,
            email: req.body.email
        }), req.body.password);

        console.log(newUser);

        passport.authenticate("local")(req, res, () => {
            res.redirect("/cities");
        });
    } catch(err) {
        console.log(err);
        res.send(err);
    }
});

// Login - Show Route
router.get("/login", (req, res) => {
    res.render("login");
});

// Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/cities",
    failureRedirect: "/login"
}));

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {return next(err);}
        res.redirect("/cities");
    });
});

module.exports = router;