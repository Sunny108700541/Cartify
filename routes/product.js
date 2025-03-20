const express=require("express");
const router=express.Router();
const fs = require("fs");
const path = require("path");

const {productModel, validateProduct}=require("../models/product");
const {categoryModel,validateCategory}=require("../models/category");
const {cartModel}=require("../models/cart");
const {validateAdmin,userIsLoggedIn}=require("../middlewares/adminmiddle");
const {userModel}=require("../models/user");
const upload=require("../config/multerconfig");

//router.get("/",userIsLoggedIn,async function(req,res){
  //   let products=await productModel.find();
   //  console.log(products);
  //   res.render("index",{products});
//});

router.get("/", userIsLoggedIn, async function(req, res) {
     try {
          let somethingInCart = false;
         let products = await productModel.find();
 
         // Group products by category
         let formattedProducts = products.reduce((acc, product) => {
             if (!acc[product.category]) {
                 acc[product.category] = [];
             }
             acc[product.category].push(product);
             return acc;
         }, {});

         let cart =await cartModel.findOne({user:req.session.passport.user});
         if(cart && cart.products.length>0){
              somethingInCart=true;
         }
         let rmproduct=await productModel.aggregate([{$sample:{size:3}}]);
         console.log("Random Products:", rmproduct);
       //  console.log("Formatted Products:", formattedProducts); // Debugging line
       const user = req.session.passport ? await userModel.findById(req.session.passport.user) : null;
         res.render("index", { products: formattedProducts,rmproduct ,somethingInCart,cartcount:cart.products.length,user});
     } catch (err) {
         console.error(err);
       res.redirect("/users/login"); // Redirect to login page on error
         //res.status(500).send("Error fetching products");
     }
 });


 

 


router.post("/", async function(req,res){
     try{
     //console.log("Received Request Body:", req.body);
     //console.log("Received File:", req.file);
 
     
     //const imageBuffer = fs.readFileSync(req.file.path);
     let {image,name,price,category,stock,description}=req.body;
     let{error}=validateProduct({
          name,
          price,
          category,
          stock,
          description,
          image,// isko string chahiye
     });
     if(error) return res.send(error.message);
     let iscategory=await categoryModel.findOne({name:category});
     if(!iscategory){
          await categoryModel.create({name:category});
     }

     let product =await productModel.create({
          name,
          price,
          category,
          stock,
          description,
          image,


     }); 

    res.redirect(`/admin/products`);
     //res.render("admin_products");
}
catch(err){
     console.log(err);
}
});


 
 


 


router.get("/delete/:id",async function(req,res){
     let prods= await productModel.findOneAndDelete({_id:req.params.id});
    // return res.redirect(prods);
     res.redirect("/admin/products");
})

router.post("/delete",async function(req,res){
     let prods= await productModel.findOneAndDelete({
          _id:req.body.product_id,
     });
     res.redirect("back"); 
})

router.get("/list", async function (req, res) {
     try {
       let products = await productModel.find();
       res.render("admin_products", { products });
     } catch (err) {
       console.log(err);
       res.status(500).send("Internal server error");
     }
   });


   // search product functionality
   router.get("/search", async (req, res) => {
     try {
         let searchQuery = req.query.query;
         
         // Find products whose name or category matches the search query (case-insensitive)
         let products = await productModel.find({
             $or: [
                 { name: { $regex: searchQuery, $options: "i" } },
                 { category: { $regex: searchQuery, $options: "i" } }
             ]
         });
 
         res.render("searchResults", { products });
     } catch (error) {
         console.log("Error while searching:", error);
         res.status(500).send("Internal Server Error");
      // res.redirect("/login"); // Redirect to login page on error
      
     }
 });




module.exports=router;
