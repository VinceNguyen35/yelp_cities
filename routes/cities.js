const express = require("express");
const router = express.Router();
const City = require("../models/city");
const Comment = require("../models/comment");
const isLoggedIn = require("../utils/isLoggedIn");
const checkCityOwner = require("../utils/checkCityOwner");

// Index Route
router.get("/", async (req, res) => {
    try {
        const cities = await City.find().exec();
        res.render("cities", {cities});
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Create Route
router.post("/", isLoggedIn, async (req, res) => {
    const newCity = {
        cityName: req.body.cityName,
        countryName: req.body.countryName,
        continent: req.body.continent,
        population: req.body.population,
        currencyUsed: req.body.currencyUsed,
        description: req.body.description,
        image: req.body.image,
        owner: {
            id: req.user._id,
            username: req.user.username
        },
        upvotes: [req.user.username],
        downvotes: []
    }

    try {
        const city = await City.create(newCity);
        req.flash("success", "City Created!");
        res.redirect("/cities/" + city._id);
    } catch(err) {
        console.log(err);
        req.flash("error", "Create City Failed.");
        res.redirect("/cities");
    }
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("cities_new");
});

// Search Route
router.get("/search", async (req, res) => {
    try {
        const cities = await City.find({
            $text: {
                $search: req.query.search
            }
        });
        res.render("cities", {cities});
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Continents Route
router.get("/continents/:continent", async (req, res) => {
    const validContinents = [
        "north-america",
        "south-america",
        "europe",
        "asia",
        "africa",
        "australia",
        "oceania",
        "antarctica"
    ];
    // Check if the given continent is valid
    if(validContinents.includes(req.params.continent.toLowerCase())) {
        // Capitalize first letter to help with finding
        var continentName = req.params.continent.charAt(0).toUpperCase() + req.params.continent.slice(1);
        // Special case for North and South America
        if(continentName === "North-america") {
            continentName = "North America";
        }
        if(continentName === "South-america") {
            continentName = "South America";
        }
        // If yes, continue
        const cities = await City.find({continent: continentName}).exec();
        res.render("cities", {cities});
    } else {
        // If no, send an error
        req.flash("error", "Please enter a valid continent.");
        res.redirect("/cities");
    }
});

// Vote
router.post("/vote", (req, res) => {
    res.json({
        message: "Voted!"
    });
});

// Show Route
router.get("/:id", async (req, res) => {
    try {
        const city = await City.findById(req.params.id).exec();
        const comments = await Comment.find({cityId: req.params.id});
        res.render("cities_show", {city, comments});
    } catch(err) {
        console.log(err);
        res.redirect("/cities");
    }
});

// Edit Route
router.get("/:id/edit", checkCityOwner, async (req, res) => {
    try {
        const city = await City.findById(req.params.id).exec();
        res.render("cities_edit", {city});
    } catch(err) {
        console.log(err);
        req.flash("error", "Edit City Failed.");
        res.redirect("/cities");
    }
});

// Update Route
router.put("/:id", checkCityOwner, async (req, res) => {
    const city = {
        cityName: req.body.cityName,
        countryName: req.body.countryName,
        continent: req.body.continent,
        population: req.body.population,
        currencyUsed: req.body.currencyUsed,
        description: req.body.description,
        image: req.body.image
    }

    try {
        const updatedCity = await City.findByIdAndUpdate(req.params.id, city, {new: true}).exec();
        req.flash("success", "City updated!");
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        req.flash("error", "Update City Failed.");
        res.redirect("/cities");
    }
});

// Delete Route
router.delete("/:id", checkCityOwner, async (req, res) => {
    try {
        const deletedComments = await Comment.deleteMany({cityId: req.params.id});
        const deletedCity = await City.findByIdAndDelete(req.params.id).exec();
        req.flash("success", "City deleted!");
        res.redirect("/cities");
    } catch(err) {
        console.log(err);
        req.flash("error", "Delete City Failed.");
        res.redirect("/cities");
    }
});

module.exports = router;