// v11deployed in video is v13deployed here

// https://polar-bastion-87144.herokuapp.com/ | https://git.heroku.com/polar-bastion-87144.
// git

var express= require('express');
var app= express();
var bodyparser= require("body-parser");
const mongoose = require('mongoose');
var flash=       require("connect-flash");
var	passport=               require("passport");
var LocalStrategy=          require("passport-local");
	// passportLocalMongoose=  require("passport-local-mongoose");	
var methodOverride = require("method-override");
var Campground= require("./models/campground");
var Comment= require("./models/comment");
var User= require("./models/user");
var seedDB   =require("./seeds");


//requiring routes
var commentRoutes   = require("./routes/comments"),
		campgroundRoutes= require("./routes/campgrounds"),
		indexRoutes      = require("./routes/index");

// mongoose.connect('mongodb://localhost/yelp_camp_v13deployed', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

mongoose.connect('mongodb+srv://gavkmr2001:Gaurav@94310@cluster0.3mlbg.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// __dirname shows /workspace/wdb/Yelpcamp/v5
app.use(express.static(__dirname + "/public"));
// _method is conventional
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "hi there.." ,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//creating a new LocalStrategy using the User.authenticate method that is coming from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
//encoding the data ---these comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
//reading the session taking data from the session and unencoding them
passport.deserializeUser(User.deserializeUser());

//for defining currentUser on all pages ...acts as middleware
app.use(function(req,res ,next){
		// instead of writitng these on many times we write it once here
	res.locals.currentUser= req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
//appends /campgrounds in front of all the campgroundRoutes



app.listen(process.env.PORT || 3000 , process.env.IP, function(){
	console.log("the yelpcamp server has started");
})

