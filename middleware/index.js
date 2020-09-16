var Campground= require("../models/campground");
var Comment= require("../models/comment");
// all the middleware goes here
 var middlewareObj ={}
 
 middlewareObj.checkCampgroundOwnership =function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				//send the user back to where they came from
				req.flash("error", "campground not found");
				res.redirect("back");
			} else{
				//does user own the campground? ---checking if both are equal
				if(foundCampground.author.id.equals(req.user._id)|| req.user.isAdmin){
					next();
				} else{
					//send the user back to where they came from
					req.flash("error", "permission denied");
					res.redirect("back");
				}
			}
		});
	} else {
	//send the user back to where they came from
		req.flash("error", "Please login first");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership= function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "comment not found");
				//send the user back to where they came from
				res.redirect("back");
			} else{
				//does user own the comment? ---checking if both are equal
				// console.log(req.user._id);
				// console.log(foundComment.author.id);
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else{
					req.flash("error", "permission denied");
					//send the user back to where they came from
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please login first");
	//send the user back to where they came from
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
		// below the sequence must be followed
		req.flash("error", "Please login first");
    res.redirect("/login");
}
 
 
 module.exports= middlewareObj;


