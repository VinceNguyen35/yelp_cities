const express = require("express");
const City = require("../models/city");
const User = require("../models/user");
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

module.exports = router;