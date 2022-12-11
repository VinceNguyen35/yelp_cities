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

// Account Route
router.get("/account/:id", isLoggedIn, (req, res) => {
    try {
        res.render("account");
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Account Edit Route
router.get("/account/:id/edit", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec();
        res.render("account_edit", {user});
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Account Update Route
router.put("/account/:id", async (req, res) => {
    const newUser = {
        email: req.body.email,
        username: req.body.username
    }

    // Update Session Info If Needed
    req.session.passport.user = newUser.username;
    console.log(req.session.passport);

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, newUser, {new: true}).exec();
        req.flash("success", "User updated!");
        res.redirect(`/account/${req.params.id}`);
    } catch(err) {
        console.log(err);
        req.flash("error", "Update User Failed.");
        res.redirect("/cities");
    }
});

// Password Edit Route
router.get("/password/:id/edit", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec();
        console.log(req.session.passport);
        res.render("password_edit", {user});
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Password Update Route
router.put("/password/:id", async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;

        // Check if user input matches
        if(newPassword === confirmNewPassword) { // Passwords match
            const updatedUser = await User.findById(req.params.id).exec();
            updatedUser.setPassword(newPassword, () => {
                updatedUser.save();
            });
            req.flash("success", "Password updated!");
            res.redirect(`/account/${req.params.id}`);
        } else { // Passwords don't match
            req.flash("error", "Your passwords do not match. Try again.");
            res.redirect(`/password/${req.params.id}/edit`);
        }
    } catch(err) {
        console.log(err);
        req.flash("error", "Update Password Failed.");
        res.redirect("/cities");
    }
});

module.exports = router;