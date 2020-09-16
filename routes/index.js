var express= require('express');
var router = express.Router();
var	passport=require("passport");
var User= require("../models/user");
var Campground= require("../models/campground"); 
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


//root route =====================================================================================
router.get("/", function(req,res){
	res.render("landing");
});


//show signup form==================================================================================
router.get("/register", function(req,res){
	res.render("register");
});

//handle signup logic ===========================================================
router.post("/register", function(req,res){
	var newUser= new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			avatar: req.body.avatar
		});
	//check adminuser role youtube video at 6 minutes
	// eval(require("locus"))
	if(req.body.adminCode === "admin"){
		newUser.isAdmin = true;
	}
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


// ==================================================================================================
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

// ========================================================================================
//LOGOUT ROUTE===============
// =====================================================================================
//when we logout nothing is changed in the db...we just passport destroys all the user data in the session
router.get("/logout", function(req,res){
//passport destroys all the user data in the session
// .logout comes from the package have installed
	req.logout();
	req.flash("success", "See You Later!");
	res.redirect("/campgrounds");
});


//FORGOT PASSWORD ============================================================================
router.get("/forgot", function(req,res){
	res.render("forgot");
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {				
          user: 'gauravkumarb21cse@gmail.com',
					//export GMAILPW= urpassword in terminal
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gauravkumarb21cse@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'learntocodeinfo@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

// ================================================================================================================


//USER PROFILE =================================================================================================
router.get("/users/:id", function(req,res){
	User.findById(req.params.id, function(err,foundUser){
		if(err){
			req.flash("error","Something went wrong.");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err,campgrounds){
			if(err){
				req.flash("error","Something went wrong.");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});	
	});
});

// =========================================================================================================================

module.exports= router;

