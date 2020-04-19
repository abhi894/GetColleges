var express         = require("express"), 
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
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
app.use(flash());


    
// including models of database

var College     = require("./models/college"),
    User        = require("./models/user");


// Including Routes

var collegeRoutes = require("./routes/college"),
    indexRoutes    = require("./routes/index");

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
    res.locals.msg = req.flash("msg");
    next();
});

// using routes


app.use(collegeRoutes);
app.use(indexRoutes);


app.listen((process.env.PORT || 3000), function(){
    console.log("Server Active...");
})