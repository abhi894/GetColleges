var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose         = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb+srv://abhiabhi:abhiabhi@testing-q1asg.gcp.mongodb.net/test?retryWrites=true&w=majority');
    
            // College DataBase
var collegeSchema = new mongoose.Schema({
    name: String,
    place: String,
    phone: Number
});
var College = mongoose.model("College", collegeSchema);
    
    College.create({
        name : "abhi",
        place : "jiji",
        phone : 41421442
    }, function(err,college){
        if(err)
        console.log("error");
        else
        console.log(college);
    });





app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("assets/images"));
app.set("view engine","ejs");








app.get("/",function(req,res){
    res.render("index");
});

var array= [
    { name : "abhi",
      mark : "10"},
    { name : "jiji", 
      mark : "20"}
];

app.get("/college",function(req,res){ 
    
    res.render("college",{array : array});
});

app.get("/college/new",function(req,res){
    res.render("newcollege");
});

app.post("/college",function(req,res){
    var name = req.body.name;
    var mark = req.body.mark;
    var newEntry = { name : name , mark : mark};
    array.push(newEntry);

    res.redirect("/college");
});

app.get("*" , function(req,res){
    res.render("notFound");
});

app.listen(3000, function(){
    console.log("Server Active...");
})