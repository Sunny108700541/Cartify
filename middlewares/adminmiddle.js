const jwt=require("jsonwebtoken")
require("dotenv").config();
function validateAdmin(req,res,next){
     try{
          let token=req.cookies.token;
          console.log(token);
     if(!token){
          return res.status(401).send("Access Denied");
     }
     const decoded=jwt.verify(token,process.env.JWT_KEY);
     req.user=decoded;
     next();

     }
     catch(err){
          res.send("not verify hai token");
     }
}

function userIsLoggedIn(req,res,next){
     if(req.isAuthenticated()){
          return next();
     }
     else{
          res.redirect("/users/login");
     }
}
module.exports={validateAdmin,userIsLoggedIn};