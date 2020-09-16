const mongoose = require('mongoose');

//SCHEMA SETUP
var commentSchema= new mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	// used in campgrounds>> show.ejs
	author: {
		id: {
	// done the same thing in compounds 
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

// compiling the schema into model
module.exports = mongoose.model("Comment", commentSchema);
