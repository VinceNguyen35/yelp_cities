const express = require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");

// Landing Page
router.get("/", (req, res) => {
    res.render("landing");
});

// Redirect from Landing Page to Cities Index Route
router.post("/", (req, res) => {
    res.redirect("/cities");
});

// Account Route
router.get("/account", isLoggedIn, (req, res) => {
    res.render("account");
});

module.exports = router;