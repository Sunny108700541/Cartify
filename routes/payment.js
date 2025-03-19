const express = require("express");
const router = express.Router();
const orderModel = require("../models/order");
const {cartModel} = require("../models/cart");
const { userIsLoggedIn } = require("../middlewares/adminmiddle");
const checkCart=require("../middlewares/checkdelivery");

// Payment Page Route
router.get("/", userIsLoggedIn,checkCart, async (req, res) => {
  try {
    const userId = req.session.passport.user;
    
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    res.render("payment", { userId }); // Render the payment page with the user ID
  } catch (error) {
    console.error("Error loading payment page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Process Payment Route
router.post("/process-payment", userIsLoggedIn, async (req, res) => {
  try {
    const { userId, upi_id } = req.body;

    if (!upi_id) {
      return res.status(400).send("UPI ID is required");
    }

    const order = await orderModel.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(400).send("No order found for this user");
    }

      // Fetch user's cart
      const cart = await cartModel.findOne({ user: userId });

      if (!cart) {
        console.log(" Cart not found for user:", userId);
        return res.status(400).send("Cart not found.");
      }
  
      console.log(" Cart before clearing:", cart);
  
      // Ensure cart has products before clearing
      if (!cart.products || cart.products.length === 0) {
        console.log(" Cart is already empty. No need to clear.");
      } else {
        // Clear the cart
        cart.products = [];
        cart.totalPrice = 0;
  
        console.log(" Cart after clearing (before save):", cart);
  
        //  Save the updated cart
        await cart.save();
        console.log("Cart cleared successfully!");
      }
  

    // Simulate payment processing (Replace this with actual payment gateway integration)
    console.log(`Processing payment for user ${userId} with UPI ID: ${upi_id}`);

     //Update order status (Assuming you have a `status` field in your order model)
    order.status = "Paid";
    
   
    await order.save();
    // we are clearing the cart after payment
    

    res.redirect("/"); // Redirect to orders page after payment
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).send("Error processing payment");
  }
});

module.exports = router;
