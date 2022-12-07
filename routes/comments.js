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
        });
        req.flash("success", "Comment added!");
        res.redirect(`/cities/${req.body.cityId}`);
    } catch(err) {
        console.log(err);
        req.flash("error", "Create Comment Failed.");
        res.redirect("/cities");
    }
});

// Edit Route - Show the Edit Form
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
    try {
        const city = await City.findById(req.params.id).exec();
        const comment = await Comment.findById(req.params.commentId).exec();
        res.render("comments_edit", {city, comment});
    } catch(err) {
        console.log(err);
        req.flash("error", "Edit Comment Failed.");
        res.redirect("/cities");
    }
});

// Update Route - Actually Update in the Database
router.put("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
        console.log(comment);
        req.flash("success", "Comment updated!");
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        req.flash("error", "Edit Comment Failed.");
        res.redirect("/cities");
    }
});

// Delete Route
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        console.log(comment);
        req.flash("success", "Comment deleted!");
        res.redirect(`/cities/${req.params.id}`);
    } catch(err) {
        console.log(err);
        req.flash("error", "Delete Comment Failed.");
        res.redirect("/cities");
    }
});

module.exports = router;