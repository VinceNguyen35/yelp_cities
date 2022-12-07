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
        res.send("You broke it... /index");
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
        }
    }

    try {
        const city = await City.create(newCity);
        console.log(city);
        res.redirect("/cities/" + city._id);
    } catch(err) {
        console.log(err);
        res.send("Broken again... POST city");
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
        res.send("Broken Search");
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
        res.send("Please enter a valid continent");
    }
});

// Show Route
router.get("/:id", async (req, res) => {
    try {
        const city = await City.findById(req.params.id).exec();
        const comments = await Comment.find({cityId: req.params.id});
        res.render("cities_show", {city, comments});
    } catch(err) {
        console.log(err);
        res.send("You broke it... /show city");
    }
});

// Edit Route
router.get("/:id/edit", checkCityOwner, async (req, res) => {
    const city = await City.findById(req.params.id).exec();
    res.render("cities_edit", {city});
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
        console.log(updatedCity);
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        res.send("Broken again... Update route");
    }
});

// Delete Route
router.delete("/:id", checkCityOwner, async (req, res) => {
    try {
        const deletedCity = await City.findByIdAndDelete(req.params.id).exec();
        console.log("Deleted:", deletedCity);
        res.redirect("/cities");
    } catch(err) {
        res.send("Error deleting:", err);
    }
});

module.exports = router;