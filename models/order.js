const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    },
  ],
  totalAmount: { type: Number, required: true },
  gstCharge: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  address: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
