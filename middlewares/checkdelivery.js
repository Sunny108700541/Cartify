const {cartModel} = require("../models/cart"); // Import the Cart model

const checkCart = async (req, res, next) => {
    try {
        const userId = req.user ? req.user._id : req.session.userId;
        
        if (!userId) {
            return res.status(403).render("error", { message: "User not logged in." });
        }

        // Fetch the cart from the database
        const cart = await cartModel.findOne({ user: userId });

        if (!cart || cart.products.length === 0) {
            return res.status(403).render("error", { message: "Oops! Your cart is empty. Please add products before checkout." });
        }

        // Sync session cart with database
        req.session.cart = cart.products;

        next(); // Proceed if products exist
    } catch (error) {
        console.error("Cart check error:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
};

module.exports = checkCart;
