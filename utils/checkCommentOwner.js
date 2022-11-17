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
            res.redirect("back");
        }
    } else {
        // If not logged in, redirect to login page
        res.redirect("/login");
    }
}

module.exports = checkCommentOwner;