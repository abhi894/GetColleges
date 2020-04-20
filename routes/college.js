var express = require("express");
var router  = express.Router();
var College = require("../models/college");
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

router.post("/college",middleware.adminUser, upload.single('image'),function(req,res){

    cloudinary.uploader.upload(req.file.path, function(result) {

        var image = result.secure_url;
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
            image: image,
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
            else{
                
                res.redirect("/college/" + collegeid);
            }
            
        });
    });
});

router.get("/colleges",function(req,res){
    
    College.find( {  }, function (err,maindata) {
        
        if(err){
         console.log(err);
        }
        else{
            res.render("colleges", {maindata : maindata});
        }
    });

});

router.get("/college/:collegeid" , function(req,res){

    College.findOne( { collegeid : req.params.collegeid }, function (err,maindata) {
        
        if(err){
         console.log(err);
        }
        else{
            if(maindata)
            res.render("college", {maindata : maindata});
            else
            res.render("notFound");
        }
    });
});

router.get("/college/:collegeid/edit",middleware.adminUser, function(req,res){


        College.findOne( { collegeid : req.params.collegeid }, function (err,editdata) {
        
            if(err){
             console.log(err);
            }
            else{
                if(editdata)
                res.render("editcollege", {editdata : editdata});
                else
                res.render("notfound");
            }
            });



});

router.put("/college/:collegeid",middleware.adminUser,upload.single('image'),function(req,res){

   
    
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
            req.flash("msg", " Sucessfully Updated!! ")
            res.redirect("/college/" + req.params.collegeid);

        }
    });

});

router.delete("/college/:collegeid",middleware.adminUser,function(req,res){
    
    College.deleteOne( { collegeid : req.params.collegeid }, function (err) {
        
        if(err){
         console.log(err);
        }
        else{
            req.flash("msg", " SucessFully Deleted!! ");
            return res.redirect("/colleges");

        }
    });


});

router.get("/new/college",middleware.adminUser,function(req,res){
    res.render("newcollege");
});





module.exports = router;