var mongoose = require("mongoose");


    // College DataBase
    var collegeSchema = new mongoose.Schema({
        collegeid : String,
        name: String,
        place: String,
        date: { type: Date, default: Date.now},
        facts: [ String ],
        estYear: Number,
        affiliation: String,
        about: String,
        data: String,
        image: String,
        type : String,
        contact: { phone: String, email: String},
        location: String,
        admit: Boolean,
        placement : [{ year: String, average : String , highest: String, percentage: String }],
        gallery: [String]
        
    });
    
    module.exports = mongoose.model("College", collegeSchema);
    