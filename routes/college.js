var express = require("express");
var router  = express.Router();
var College = require("../models/college");
var Course = require("../models/courses");
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

router.post("/college", upload.single('image'),function(req,res){

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

        var type = req.body.category;
        var fact1 = req.body.fact1;
        var fact2 = req.body.fact2;
        var fact3 = req.body.fact3;
        var fact4 = req.body.fact4;
        var cover = req.body.cover;

        var placement1= { year: req.body.p1name, average : req.body.p1avg , highest: req.body.p1high, percentage: req.body.p1per }
        var placement2= { year: req.body.p2name, average : req.body.p2avg , highest: req.body.p2high, percentage: req.body.p2per }

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
            admit: admit,
            type : type,
            fact: [fact1,fact2,fact3,fact4],
            placement: [placement1,placement2],
            cover: cover

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

router.get("/new/courses/:collegeid",function(req,res){
            res.render("addcourses",{collegeid : req.params.collegeid});

});

router.post("/courses/:collegeid",function(req,res){

    

        
        var collegeid = req.params.collegeid;
        var category = req.body.category;
        var level = req.body.level;
        var eligibility = req.body.eligibility;
        var term = req.body.term;


        var fee1 = { quota : req.body.quota1,
                     term : req.body.tm1, 
                     amount : req.body.amt1,
                     hostel : req.body.hst1
                      };

        var fee2 = { quota : req.body.quota2,
            term : req.body.tm2,
        amount : req.body.amt2,
        hostel : req.body.hst2
          };


        var newEntry = {
            category : category,
            college : collegeid,
            level : level,
            eligibility : eligibility,
            term : term,
            fees : [fee1,fee2]
        }
        
        Course.create(newEntry, function (err, newEntry) {
            if(err)
            console.log("error"+ err);
            else{
                
                res.redirect("/college/" + collegeid);
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

router.get("/new/college",function(req,res){
    res.render("newcollege");
});





module.exports = router;