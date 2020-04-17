var express         = require("express"), 
    methodOverride  = require("method-override"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    mongoose        = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://abhiabhi:abhiabhi@testing-q1asg.gcp.mongodb.net/test?retryWrites=true&w=majority');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");


    
// including models of database

var College     = require("./models/college"),
    User        = require("./models/user");


// Passport configuration

app.use(require("express-session")({
    secret: "Take admission in colleges!",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


// Auth Routes

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/login" ,function(req,res){
    res.render("login");
});
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/colleges");
});

//handle Sign up logic
app.post("/register",function(req,res){
    var newUser = new User({ username : req.body.username,
                             phone : req.body.phone,
                             name : req.body.name,
                             admin : '0',
                             master : '0',
                             active : '1'     });

    User.register(newUser, req.body.password, function(err,user){
        if(err){
        console.log(err);
        return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/colleges");
        });
    });
});

app.post("/login", passport.authenticate("local",{
                                                    successRedirect:"/colleges",
                                                    failureRedirect: "/login"
                                                    }), function(req,res){
});

function isLoggedIN(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    res.redirect("/login");
}


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

app.get("/college/:collegeid/edit", isLoggedIN , function(req,res){
    
    College.find( { collegeid : req.params.collegeid }, function (err,editdata) {
        
        if(err){
         console.log(err);
        }
        else{
            res.render("editcollege", {editdata : editdata});

        }
    });

});

app.put("/college/:collegeid",isLoggedIN,function(req,res){

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
            res.redirect("/college/" + req.params.collegeid);

        }
    });

});

app.delete("/college/:collegeid",isLoggedIN,function(req,res){
    
    College.deleteOne( { collegeid : req.params.collegeid }, function (err) {
        
        if(err){
         console.log(err);
        }
        else{

            res.redirect("/colleges");

        }
    });


});

app.get("/new/college",isLoggedIN,function(req,res){
    res.render("newcollege");
});

app.get("*" , function(req,res){
    res.render("notFound");
});

app.listen(3000, function(){
    console.log("Server Active...");
})