/////////////////////////////////////////////////////////////////////////
// IMPORTS
/////////////////////////////////////////////////////////////////////////

// NPM Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

// Config Import
const config = require("./config");

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

// Connect to Database
mongoose.connect(config.db.connection);

// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));

// Express Session Config
app.use(expressSession({
    secret: "kjfoisjdsoifnknciodafjewoifjaposdfsaifdpjfsdpaf",
    resave: false,
    saveUninitialized: false
}));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride("_method"));

// Passport Config
app.use(passport.initialize()); // initialize
app.use(passport.session()); // Allows persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get the user data from stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy

// Current User Middleware Config
app.use((req, res, next) => {
    res.locals.user = req.user;
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
app.listen("3000", () => {
    console.log("yelp_cities is running");
});