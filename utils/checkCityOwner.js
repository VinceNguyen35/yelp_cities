const City = require("../models/city");

const checkCityOwner = async (req, res, next) => {
    // Check if the user is logged in
    if(req.isAuthenticated()) {
        const city = await City.findById(req.params.id).exec();
        // If logged in, check if they own the city
        if(city.owner.id.equals(req.user._id)) {
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

module.exports = checkCityOwner;