const express=require("express");
const router=express.Router();

const profileModel=require("../models/profile");
const {userModel}=require("../models/user");
const {userIsLoggedIn}=require("../middlewares/adminmiddle");

router.get("/:id",userIsLoggedIn,async function(req,res){
     try{
          let profile=await userModel.findById(req.params.id);
          console.log("Profile: YAHA AA RHE HAI",profile);
          res.render("profile",{profile});
     }catch(err){
          console.error(err);
          res.status(500).send("Error fetching profile");
     }

})

module.exports=router;