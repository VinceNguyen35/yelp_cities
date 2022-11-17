const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
    }
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;