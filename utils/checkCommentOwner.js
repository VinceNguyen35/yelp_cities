const Comment = require("../models/comment");

const checkCommentOwner = async (req, res, next) => {
    // Check if the user is logged in
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId).exec();
        // If logged in, check if they own the comment
        if(comment.owner.id.equals(req.user._id)) {
            // If owner, do the next step
            next();
        } else {
            // If not owner, redirect back to the show page
            req.flash("error", "You don't have permission to do that!");
            res.redirect("back");
        }
    } else {
        // If not logged in, redirect to login page
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = checkCommentOwner;