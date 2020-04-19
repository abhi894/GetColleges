

var middlewareObj = {};

middlewareObj.isLoggedIN = function (req,res,next){
    if(req.isAuthenticated()){
         next();
    }
    else{
    req.flash("msg", " You must Login first!! ")
    return res.redirect("/login");
}}

middlewareObj.adminUser = function (req,res,next){

    if(req.isAuthenticated()){

        if(req.user.admin == true) {
            next();
        }
        else{
        req.flash("msg", " Permission Denied!! ")
        return res.redirect("back");
    }}

    else{
    req.flash("msg", " You must Login first!! ")
    return res.redirect("back");
    }
}

module.exports = middlewareObj;