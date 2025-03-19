const express = require("express");
const router = express.Router();
const { productModel } = require("../models/product");
const { cartModel } = require("../models/cart");
const { userModel } = require("../models/user");

router.get("/", async function (req, res) {
  try {
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
    const userId = req.session.passport ? req.session.passport.user : null;
    const user = userId ? await userModel.findById(userId) : null;

    // Convert the array to a pure object (No array wrapping)
    const formattedResult = result.reduce((acc, { category, products }) => {
      acc[category] = products;  // Directly assign array of products to category key
      return acc;
    }, {});

    let cartcount = 0;
    if (req.user) {
      const cart = await cartModel.findOne({ user: req.user._id });
      if (cart) {
        cartcount = cart.products.length;
      }
    }
    let rmproduct=await productModel.aggregate([{$sample:{size:3}}]);

    res.render("index", { products: formattedResult,rmproduct,cartcount,user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;