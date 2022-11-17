const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const City = require("../models/city");
const isLoggedIn = require("../utils/isLoggedIn");
const checkCommentOwner = require("../utils/checkCommentOwner");

// New Route - Show Form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("comments_new", {cityId: req.params.id});
});

// Create Route - Actually Update DB
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.create({
            owner: {
                id: req.user._id,
                username: req.user.username
            },
            text: req.body.text,
            cityId: req.body.cityId
        })
        console.log(comment);
        res.redirect(`/cities/${req.body.cityId}`);
    } catch(err) {
        console.log(err);
        res.send("Broken Again... POST comments");
    }
});

// Edit Route - Show the Edit Form
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
    try {
        const city = await City.findById(req.params.id).exec();
        const comment = await Comment.findById(req.params.commentId).exec();
        console.log("city:", city);
        console.log("comment:", comment);
        res.render("comments_edit", {city, comment});
    } catch(err) {
        console.log(err);
        res.send("Broke comment Edit GET");
    }
});

// Update Route - Actually Update in the Database
router.put("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
        console.log(comment);
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        res.send("Brokeen comment update PUT");
    }
});

// Delete Route
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        console.log(comment);
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        res.send("Broken Comment DELETE");
    }
});

module.exports = router;