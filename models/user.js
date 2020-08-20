const mongoose = require('mongoose');
var passportLocalMongoose=  require("passport-local-mongoose");


var UserSchema= new mongoose.Schema({
	username: String,
	password: String
});

//adds a bunch of packages from passportLocalMongoose to our schema
UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", UserSchema);