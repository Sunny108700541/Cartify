const express = require("express");
const router = express.Router();
const { cartModel } = require("../models/cart");
const { productModel } = require("../models/product");
const orderModel=require("../models/order");
const { userModel } = require("../models/user");
const { userIsLoggedIn } = require("../middlewares/adminmiddle");
const checkCart = require("../middlewares/checkdelivery");

router.get("/", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");
    const user = req.session.passport ? await userModel.findById(req.session.passport.user) : null;
    console.log("Populated Cart:", JSON.stringify(cart, null, 2));
   
    if (!cart || !cart.products || !Array.isArray(cart.products)) {
      console.log("No cart or empty cart found!");
      return res.render("cart", { cart: { products: [] }, totalAmount: 0,user });
    }

    // Filter out undefined values
    cart.products = cart.products.filter(p => p && p._id);
    console.log("Cart Products After Filtering:", cart.products);

    let cartDataStructure = {};

    cart.products.forEach((product) => {  // Fix: Directly access 'product' 
      let productId = product._id.toString(); //  Fix: Use 'product._id' instead of 'product.product._id'
      if (cartDataStructure[productId]) {
        cartDataStructure[productId].quantity += 1;
      } else {
        cartDataStructure[productId] = {
          ...product._doc,  //  Fix: Spread the whole product object
          quantity: 1,
        };
      }
    });

    let finalarray = Object.values(cartDataStructure);
    let totalAmount = finalarray.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let gstCharge=totalAmount*0.18;
    let deliveryCharge=50;

    console.log("Final Cart Array:", finalarray);
    console.log("Total Amount:", totalAmount);

    res.render("cart", { cart: { products: finalarray }, totalAmount,gstCharge,deliveryCharge });
  } catch (err) {
    console.error("Error in Cart Route:", err.message);
    res.send(err.message);
  }
});


router.get("/add/:id", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findById(req.params.id);

    if (!cart) {
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [req.params.id], // Store only ObjectId
        totalPrice: Number(product.price),
      });
    } else {
      cart.products.push(req.params.id); //  Push only ObjectId
      cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
       // Set flash message
      req.flash('success_msg', 'Product added to cart!');
      await cart.save();
    }

    res.redirect("back");
  } catch (err) {
    console.error("Error while adding product:", err.message);
    res.send(err.message);
  }
});


router.get("/remove/:id", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");
    if (!cart) {
      return res.send("Something went wrong while removing items");
    }

    console.log("Cart Before Removing:", cart);

    let index = cart.products.findIndex(item => item._id.toString() === req.params.id);
    if (index !== -1) {
      let productPrice = cart.products[index].price || 0; // Ensure price is defined
      cart.totalPrice -= productPrice;
      cart.products.splice(index, 1);
      await cart.save();
      console.log("Product removed successfully!");
    } else {
      return res.send("Product not found in cart");
    }
    
    res.redirect("back");
  } catch (err) {
    console.error("Error while removing product:", err.message);
    res.send(err.message);
  }
});


router.get("/delivery", (req, res) => {
  res.render("delivery");
});

// yha pe post method bhi hoga delivery address save karne ke liye

// post route hai ye
router.post("/checkout", userIsLoggedIn,checkCart, async (req, res) => {
  try {
    const { name, phone, state, city, zip } = req.body;
    const userId = req.session.passport?.user;

    console.log(" Step 1: User ID:", userId);
    if (!userId) return res.status(401).send(" ERROR: ID not found");

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send(" ERROR: User not found");

    // Fetch cart & populate products
    const cart = await cartModel.findOne({ user: userId }).populate("products");

    if (!cart || !cart.products.length) {
      console.error(" ERROR: Cart is empty!");
      return res.status(400).json({ error: "No products to order" });
    }

    // Ensure products have valid IDs
    const orderProducts = cart.products.map((product) => {
      if (!product._id) {
        console.error(" ERROR: Product missing _id:", product);
        return null; // Skip invalid products
      }
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1, // Default quantity (adjust if needed)
      };
    }).filter(Boolean); // Remove any null values

    if (!orderProducts.length) {
      console.error(" ERROR: No valid products found in cart!");
      return res.status(400).json({ error: "No valid products in cart" });
    }

    // Calculate total price
    const totalPrice = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const gstCharge = totalPrice * 0.18;
    const deliveryCharge = 50;
    // Create order object
    const order = new orderModel({
      user: userId,
      products: orderProducts,
      totalAmount: totalPrice,
      gstCharge: gstCharge, // Add logic if needed
      deliveryCharge: deliveryCharge, // Add logic if needed
      address: { state, city, zip },
    });

    // Save order to database
    await order.save();
    res.redirect("/payment");
    console.log(" Order Successfully Created:", order);

     //Clear the cart after checkout
    //cart.products = [];
    //cart.totalPrice = 0;
  //  await cart.save();
    //console.log("Step 6: Cart cleared!");

   // return res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(" ERROR: Checkout failed:", error);
    res.status(500).send(" ERROR: Processing checkout failed");
  }
});



module.exports = router;