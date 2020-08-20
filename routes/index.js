var express= require('express');
var router = express.Router();
var	passport=require("passport");
var User= require("../models/user");

//root route 
router.get("/", function(req,res){
	res.render("landing");
});


//show signup form
router.get("/register", function(req,res){
	res.render("register");
});

//handle signup logic
router.post("/register", function(req,res){
	var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
		// we dont need to manually write the errors so we use err which is defined above . err is coming from passport
			// console.log(err) ..it has 2 components-- name and message
			req.flash("error", err.message);
			return res.redirect("register");
// Per the docs, you can either set a flash message on the req.flash object before returning a res.redirect() or you can pass the req.flash object into the res.render() function.
		}	
		passport.authenticate("local")(req,res, function(){
			// user comes from the above function
			req.flash("success", "welcome to Yelpcamp "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req,res){
	res.render("login");
});

//login logic
// passport.authenticate acts as middleware
//app.post("/login",middleware, callback)
router.post("/login", passport.authenticate("local", {
//if login details are correct, redirect to
	successRedirect: "/campgrounds",
//if login details are incorrect, redirect to
	failureRedirect: "/login"
}) ,function(req,res){
});


//LOGOUT ROUTE===============
//when we logout nothing is changed in the db...we just passport destroys all the user data in the session
router.get("/logout", function(req,res){
//passport destroys all the user data in the session
// .logout comes from the package have installed
	req.logout();
	req.flash("success", "logged youout!");
	res.redirect("/campgrounds");
});



module.exports= router;

