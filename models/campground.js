const mongoose = require('mongoose');
//added for deleting the comments when campground is deleted
const Comment = require('./comment');

//found this in note after lecture 357 ...2 yrs old code.. not needed
// campgroundSchema.pre('remove', async function() {
// 	await Comment.remove({
// 		_id: {
// 			$in: this.comments
// 		}
// 	});
// });

//SCHEMA SETUP
var campgroundSchema= new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			 type: mongoose.Schema.Types.ObjectId,
			 ref: "Comment"
		}
	]
	
});

// compiling the schema into model
module.exports = mongoose.model("Campground", campgroundSchema);
