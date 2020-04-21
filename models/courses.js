var mongoose = require("mongoose");

    // College DataBase
    var coursesSchema = new mongoose.Schema({
        category : String,
        college : String,
        level : String,
        eligibility : String,
        term : String,
        fees: [{ quota: String, term: String, amount: String, hostel: String}]
    });
    
    module.exports = mongoose.model("Course", coursesSchema);
    
