var express= require('express');
var router = express.Router({mergeParams: true});
var Campground= require("../models/campground");
var Comment= require("../models/comment");
// we needed to go to middleware/index.js but we didnt write /index.js because if we dont mention then itwill automatically require contents of index.js ...thatswhy
// we named the file as index.js
var middleware = require("../middleware");


//comments new
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//comments create
router.post("/", middleware.isLoggedIn,function(req, res){
	//lookup campground with id
	Campground.findById(req.params.id ,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					req.flash("error", "something went wrong");
					console.log(err);
				} else{
						//connect new comment to campground
	//campground below is the campground variable in callback
				//add username and id to comment
					// comment.author._id= req.user._id; ...this is wrong 
					comment.author.id= req.user._id;
					comment.author.username= req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					// console.log(comment);
					req.flash("success", "successfully added comment");
					//redirect to campgroundshow page
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});


//COMMENT EDIT ROUTE
// app.use("/campgrounds/:id/comments",commentRoutes);
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Campground.findById(req.params.id , function(err, foundCampgroud){
	// if someone changes the campground id then app shouldnt collapse
		if(err || !foundCampgroud){
			req.flash("error", "no campground found");
			//send the user back to where they came from
			res.redirect("back");
		}
		// finding the particular comment
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
		// in edit.ejs foundComment will be denoted by comment and req.params.id by campground._id	
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});



//COMMENT UPDATE ROUTES
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else {
			//redirect to show page
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id" , middleware.checkCommentOwnership, function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "comment deleted");
			// here id means campground id
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});


module.exports= router;