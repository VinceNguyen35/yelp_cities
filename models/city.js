const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    cityName: String,
    countryName: String,
    continent: String,
    population: Number,
    currencyUsed: String,
    description: String,
    image: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    upvotes: [String],
    downvotes: [String]
});

citySchema.index({
    "$**": "text"
});

const City = mongoose.model("city", citySchema);

module.exports = City;