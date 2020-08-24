var express= require('express');
var router = express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
// we needed to go to middleware/index.js but we didnt write /index.js because if we dont mention then itwill automatically require contents of index.js ...thatswhy
// we named the file as index.js
var middleware = require("../middleware");

// ===============ROUTES==========

//INDEX route-- show all campground
router.get("/", function(req,res){
	// get all campgrounds from DB
	Campground.find({}, function(err,allcampgrounds){
		if(err){
			console.log(err)
		} else{
	//currentUser needs to be defined on all d pages
			res.render("campgrounds/index", {campgrounds:allcampgrounds});
		}
	});
});


//CREATE route-- add new campground to DB
router.post("/",middleware.isLoggedIn, function(req,res){
	//get data from form and add to campgrounds array
	var name= req.body.name;
	var price= req.body.price;
	var image= req.body.image;
	var desc= req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground= { name:name, price: price, image:image, description: desc, author : author}
	// console.log(req.user);
//Create a new campground and save to db
 Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
				// redirect back to campgrounds
				res.redirect("/campgrounds");
//we have 2 campgrounds, default it redirects to get rwquest 
		}
	});

});
	
//NEW route-- show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
});

//take care of the order of routes
//SHOW route--shows more info about one campground
router.get("/:id", function(req,res){
//find the campground with provided id 
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
// || denotes or ...see video note after lecture 369 in course
		if(err || !foundCampground){
			req.flash("error", "campground not found");
			res.redirect("back")
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {campground : foundCampground });
			}
	});
});

//check restful routes video
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});


// foundCampground.author.id --- is an object
// req.user._id -- is a string


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find&update the correct campgrounds..req.body.campground contains name,image,desc--see edit.ejs
	//id definedd by, data to update it with , callback
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to show page
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});


// given by colt-- here when we delete a campground the comments stay inside the db and r not deleted
// // DESTROY CAMPGROUND ROUTE
// router.delete("/:id", function(req,res){
// 	Campground.findByIdAndDelete(req.params.id, function(err){
// 		if(err){
// 			res.redirect("/campgrounds");
// 		} else{
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });


//found this in note after lecture 357 ---by monica
// // DESTROY CAMPGROUND ROUTE -here when we delete a campground the comments are also deleted
router.delete("/:id", middleware.checkCampgroundOwnership,async(req,res)=>{ 
    try { 
        let foundCampground = await Campground.findById(req.params.id); 
        await foundCampground.comments.forEach(async(comment)=>
    { 
        await Comment.findByIdAndDelete(comment._id) 
    }) 
     await foundCampground.remove(); 
    res.redirect("/campgrounds"); } 
    catch (error) { 
        res.redirect("/campgrounds"); 
    } 
})


//moved the middlewares to a separate folder


module.exports= router;
