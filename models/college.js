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
        courses: [{ level: String,
                    course : String,
                    eligibility: String,
                    term: String,
                    admfee: Number,
                     fees: { quota: String ,year: Number, amount: Number } }],

        facilities: [String],
        contact: { phone: String, email: String},
        location: String,
        admit: Boolean,
        placement : [{ year: String, average : String , highest: String, percentage: Number }],
        gallery: [String]
    });
    
    module.exports = mongoose.model("College", collegeSchema);
    