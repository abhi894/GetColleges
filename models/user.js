var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
        name : String,
        phone : Number,
        date: { type: Date, default: Date.now},
        admin : { type: Boolean, default:false },
        master :{ type: Boolean, default:false },
        state : String,
        stream : String,
        qualification : [ {
            name : String,
            level : String,
            specialize : String,
            istname : String,
            place : String,
            percentage : Number,
            Status: Boolean
        }],
        image : String,
        active : Boolean
    });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);