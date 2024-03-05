/////////////////////////////////////////////////////////////////////////
// IMPORTS
/////////////////////////////////////////////////////////////////////////

// NPM Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

// Config Import
try {
    var config = require("./config");
} catch(err) {
    console.log("Could not import config. This probably means you're not working locally.");
    console.log(err);
}

// Route Imports
const citiesRoutes = require("./routes/cities");
const commentsRoutes = require("./routes/comments");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

// Model Imports
const City = require("./models/city");
const Comment = require("./models/comment");
const User = require("./models/user");

/////////////////////////////////////////////////////////////////////////
// DEVELOPMENT
/////////////////////////////////////////////////////////////////////////

// Morgan
app.use(morgan("tiny"));

// Seed the Database
// const seed = require("./utils/seed");
// seed();

/////////////////////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////////////////////

// Mongoose Config
try {
    mongoose.connect(config.db.connection);
} catch(err) {
    console.log("Could not import config. This probably means you're not working locally.");
    mongoose.connect(process.env.DB_CONNECTION_STRING);
}

// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({
    type: ["application/json", "text/plain"]
}));

// Express Session Config
app.use(expressSession({
    secret: process.env.ES_SECRET || config.expressSession.secret,
    resave: false,
    saveUninitialized: false
}));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride("_method"));

// Conect Flash Config
app.use(flash());

// Passport Config
app.use(passport.initialize()); // initialize
app.use(passport.session()); // Allows persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get the user data from stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy

// State Config
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

// Route Config
app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/cities", citiesRoutes);
app.use("/cities/:id/comments", commentsRoutes);

/////////////////////////////////////////////////////////////////////////
// LISTEN
/////////////////////////////////////////////////////////////////////////

// Check that app is running
app.listen(process.env.PORT || 3000, () => {
    console.log("yelp_cities is running");
    console.log("CI / CD pipeline is active");
});