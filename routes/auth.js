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
        req.flash("success", `Signed up as ${newUser.username}!`);
        passport.authenticate("local")(req, res, () => {
            res.redirect("/cities");
        });
    } catch(err) {
        req.flash("error", "Signup Failed.");
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
    failureRedirect: "/login",
    successFlash: "Logged in successfully!",
    failureFlash: true
}));

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            req.flash("error", "Logout Failed.");
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/cities");
    });
});

module.exports = router;