const express = require("express");
const router = express.Router();
const {adminModel} = require("../models/admin");
console.log(adminModel);
const {productModel}=require("../models/product");
const {validateAdmin} = require("../middlewares/adminmiddle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user");
const { categoryModel } = require("../models/category");
require("dotenv").config();

if (
  typeof process.env.NODE_ENV !== "undefined" &&
  process.env.NODE_ENV === "DEVELOPMENT"
) {
  router.get("/create", async function (req, res) {
     console.log("create route fatchinfg");
    try {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash("12345678", salt);
      let user = new adminModel({
        name: "admin",
        email: "admin@blink.com",
        password: hash,
        role: "admin",
      });
      await user.save();
      let token = jwt.sign({ email: "admin@blink.com" }, process.env.JWT_KEY);
      res.cookie("token", token);
      res.send("admin created successfully");
    } catch (err) {
      console.log(err);
    }
  });
}

router.get("/login", function (req, res) {
  res.render("admin_login");
});

router.post("/login", async function (req, res) {
  let { email, password } = req.body;
  console.log(req.body);
  try {
    let admin = await adminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.send("Admin does not exist");
    }

    let valid = await bcrypt.compare(password, admin.password);
    if (valid) {
      let token = await jwt.sign({ email: admin.email }, process.env.JWT_KEY);
      res.cookie("token", token);

      // Fetch product and category count before rendering dashboard
      const productcount = await productModel.countDocuments();
      const categorycount = await categoryModel.countDocuments();

      res.render("dashbord", { productcount, categorycount });
    } else {
      res.status(400).send("Invalid password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});


router.get("/dashboard", async function (req, res) {
  try {
    const productcount = await productModel.countDocuments();
    const categorycount = await categoryModel.countDocuments();
    console.log("Product Count:", productcount);  // Debugging
    console.log("Category Count:", categorycount);  // Debugging

    res.render("dashbord", {
      productcount,
      categorycount,
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

// dashboard ki post request akaha hai

router.get("/products",validateAdmin,async function(req,res){
try{
  const result = await productModel.aggregate([
    {
        $sort: { createdAt: -1 } // Sort products by newest first (optional)
    },
    {
        $group: {
            _id: "$category",
            products: { $push: "$$ROOT" }
        }
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            products: { $slice: ["$products", 10] } // Get first 10 products per category
        }
    }
]);

// Convert the array to a pure object (No array wrapping)
const formattedResult = result.reduce((acc, { category, products }) => {
  acc[category] = products;  // Directly assign array of products to category key
  return acc;
}, {});

//for(let key in formattedResult){
 // console.log(key);
  
//}



  

  
    //let products=await productModel.find();
  res.render("admin_products",{products:formattedResult});
 // res.render("index",{products:formattedResult});
}
catch (err) {
  console.log(err);
  res.status(500).send("product me gadbad hai bahi");
}
});



router.get('/logout', (req, res) => {
  res.clearCookie("token"); // Clear token cookie
  res.redirect("/admin/login");
});



module.exports = router;


