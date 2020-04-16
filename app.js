var express         = require("express"), 
    methodOverride  =require("method-override"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb+srv://abhiabhi:abhiabhi@testing-q1asg.gcp.mongodb.net/test?retryWrites=true&w=majority');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
    
            // College DataBase
var collegeSchema = new mongoose.Schema({
    collegeid : String,
    name: String,
    place: String,
    date: { type: Date, default: Date.now},
    facts: [ { id: Number, data : String }],
    estYear: Number,
    affiliation: String,
    about: String,
    data: String,
    courses: [String],
    facilities: [String],
    contact: { phone: String, email: String},
    location: String,
    admit: Boolean
});

var College = mongoose.model("College", collegeSchema);

// RESTfull Routes

app.get("/",function(req,res){
    res.render("index");
});

app.post("/college",function(req,res){

    var collegeid = req.body.collegeid;
    var name = req.body.collegeName;
    var place = req.body.place;
    var year = req.body.year;
    var affiliation = req.body.affiliation;
    var about = req.body.about;
    var data = req.body.data;
    var location = req.body.location;
    var phone = req.body.phone;
    var email = req.body.email;
    var admit = req.body.admit;


    var newEntry = {
        collegeid : collegeid,
        name: name,
        place: place,
        estYear: year,
        affiliation: affiliation,
        about: about,
        data: data,
        contact: { phone: phone, email: email},
        location: location,
        admit: admit
    }
    College.create(newEntry, function (err, newEntry) {
        if(err)
        console.log("error"+ err);
        else
        console.log(collegeid);
        res.redirect("/college/" + collegeid);
      });

});

app.get("/colleges",function(req,res){
 
    College.find( {  }, function (err,maindata) {
        
        if(err){
         console.log(err);
        }
        else{
            res.render("colleges", {maindata : maindata});
        }
    });

});

app.get("/college/:collegeid" , function(req,res){


    College.find( { collegeid : req.params.collegeid }, function (err,maindata) {
        
        if(err){
         console.log(err);
        }
        else{
            res.render("college", {maindata : maindata});
        }
    });
});

app.get("/college/:collegeid/edit" , function(req,res){
    
    College.find( { collegeid : req.params.collegeid }, function (err,editdata) {
        
        if(err){
         console.log(err);
        }
        else{
            res.render("editcollege", {editdata : editdata});

        }
    });

});

app.put("/college/:collegeid",function(req,res){

    var name = req.body.collegeName;
    var place = req.body.place;
    var year = req.body.year;
    var affiliation = req.body.affiliation;
    var about = req.body.about;
    var data = req.body.data;
    var location = req.body.location;
    var phone = req.body.phone;
    var email = req.body.email;
    var admit = req.body.admit;


    var newEntry = {
        name: name,
        place: place,
        estYear: year,
        affiliation: affiliation,
        about: about,
        data: data,
        contact: { phone: phone, email: email},
        location: location,
        admit: admit
    }

    College.updateOne( { collegeid : req.params.collegeid },newEntry, function (err,editdata) {
        
        if(err){
         console.log(err);
        }
        else{
            console.log(editdata)
            res.redirect("/college/" + req.params.collegeid);

        }
    });

});

app.get("/new/college",function(req,res){
    res.render("newcollege");
});






app.get("*" , function(req,res){
    res.render("notFound");
});

app.listen(3000, function(){
    console.log("Server Active...");
})