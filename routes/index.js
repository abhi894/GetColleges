var express = require("express");
var router  = express.Router();
var passport = require("passport");

var User = require("../models/user");
var middleware = require("../middleware");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'abhi894', 
  api_key: '868168654876154', 
  api_secret: 'BSAkAN8Yo74wvuxghiuMG0hcp1A'
});



router.get("/",function(req,res){
    res.render("index");
});

router.get("/about",function(req,res){
    res.render("about");
});



// Auth Routes

router.get("/register", function(req,res){
    res.render("register");
});

router.get("/login" ,function(req,res){
    res.render("login");
});
router.get("/logout", function(req,res){
    req.flash("msg", " You have Sucessfully Logged Out!! ")
    req.logout();
    return res.redirect("/colleges");
});

//handle Sign up logic
router.post("/register",function(req,res){
    var newUser = new User({ username : req.body.username,
                             phone : req.body.phone,
                             name : req.body.name,
                             admin : '0',
                             active : '1'     });

    User.register(newUser, req.body.password, function(err,user){
        if(err){
 
        return res.render("register",{ msg : err.message});
        }
        else{
        passport.authenticate("local")(req, res, function(){
            req.flash("msg", " Welcome to Get Colleges " + user.name);
            return res.redirect("/colleges");
        });}
    });
});

router.post("/login",function (req, res, next) {
                    passport.authenticate("local",
                    {
                        successRedirect: "/colleges",
                        failureRedirect: "/login",
                        failureFlash: true
                    })(req, res);
                });



router.get("/profile",middleware.isLoggedIN,function(req,res){
     res.render("profile");

});


router.get("/editprofile",middleware.isLoggedIN,function(req,res){
    res.render("editprofile");

});

router.post("/profile/:username",middleware.isLoggedIN,upload.single('image'),function(req,res){


    var editUser = {         username : req.body.username,
                             phone : req.body.phone,
                             name : req.body.name,
                            }

                             User.updateOne( { username : req.params.username },editUser, function (err,editdata) {
        
                                if(err){
                                 console.log(err);
                                }
                                else{
                                    req.flash("msg", " Sucessfully Updated!! ")
                                    res.redirect("/profile");
                        
                                }
                            });
                       
});

router.get("*" , function(req,res){
    res.render("notFound");
});

module.exports = router;