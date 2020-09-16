const mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var seeds = [
{
	name: "Cloud's Rest", 
	image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
	description: "Lorem and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letripsum dolor sit amet, consectetur adipidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
},
{
	name: "Desert Mesa", 
	image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
	description: "Lorem and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letripsum dolor sit amet, consectetur adipisicing elit, sed do eilaborum"
},
{
	name: "Canyon Floor", 
	image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
	description: "Lorem ipsum dolor sit amet, consectetur acupidatat non proident, sunt in culpa quand typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letri officia deserunt mollit anim id est laborum"
}
];
 
//ian youtube
async function seedDB(){
    try {
        await Campground.remove({});
        console.log('Campgrounds removed');
        await Comment.remove({});
        console.log('Comments removed');

        for(const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log('Campground created');
            let comment = await Comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                    author: 'Homer'
                }
            )
            console.log('Comment created');
            campground.comments.push(comment);
            campground.save();
            console.log('Comment added to campground');
        }
    } catch(err) {
        console.log(err);
    }
}




//code by colt ==============its lengthy 

// function seedDB(){
// 	Comment.remove({},function(err){
// 		if(err){
//       console.log(err);
//     }
// 		console.log('removedd comments');
// 		//Remove all campgrounds
//    Campground.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//         Comment.remove({}, function(err) {
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed comments!");
// //adding this inside d callback so that new campgroundsare created only after the deletion of old campgrounds
//              //add a few campgrounds
//             data.forEach(function(seed){
//                 Campground.create(seed, function(err, campground){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a campground");
//                         //create a comment
//                         Comment.create(
//                             {
//                                 text: "This place is great, but I wish there",
//                                 author: "Homer"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     campground.comments.push(comment);
//                                     campground.save();
//                                     console.log("Created new comment");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
//     }); 
//     //add a few comments

// 	})
// }
 
module.exports = seedDB;
