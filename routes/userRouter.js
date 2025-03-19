const express=require("express");
const router=express.Router();

const {userModel,validateUser}=require("../models/user");


router.get("/login",function(req,res){
     res.render("userlogin");
});

router.get("/profile/:id", async function(req,res){
     try {
          
          const profile = await userModel.findById(req.params.id);
          if (!profile) {
              return res.status(404).send("Profile not found");
          }
          res.render("profile", { profile });
      } catch (error) {
          res.status(500).send("Error fetching profile");
      }
  

   //  res.send("profile page here ");
});




router.get("/logout",function(req,res,next){
     req.logout(function(err) {
          if (err) { return next(err); }
          req.session.destroy((err)=>{
               if(err)return next(err);
               res.clearCookie("connect.sid");
               res.redirect("/users/login");
          });
        }); 
     
});



module.exports=router;