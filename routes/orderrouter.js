const express = require("express");
const router = express.Router();
const orderModel  = require("../models/order");
const { userIsLoggedIn } = require("../middlewares/adminmiddle");

router.get("/", userIsLoggedIn, async function (req, res) {
  try {
    const orders = await orderModel.find({ user: req.session.passport.user }).populate("products.product").sort({ createdAt: -1 });
    //console.log("orders:", orders); // debug code
    console.log(JSON.stringify(orders, null, 2)); // Debugging output
    res.render("orders", { orders });
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).send("Error fetching orders");
  }
});

// post 






module.exports = router;